import { google } from "@ai-sdk/google";
import { generateObject, generateText, tool } from "ai";
import z from "zod";
import { base64ToFile, saveFile } from "./functions";
import { UTApi } from "uploadthing/server";
import { POSTGRES_PROMPT } from "@/prompt";


export const utapi = new UTApi({
  // ...options,
});



export const imageGenerationTool = () => tool({
        description: "Generate an image from a prompt using Gemini.",
        parameters: z.object({
            prompt: z.string().describe("The prompt to generate an image for")
        }),
        execute: async ({prompt}) => {
            
            const result = await generateText({
                model: google("gemini-2.0-flash-exp"),
                prompt,
                providerOptions: {
                    google: {
                        responseModalities: ["TEXT", "IMAGE"]
                    }
                },
            })

            
           for (const file of result.files) {
            if(file.mimeType.startsWith('image/')) {

                const readableFile = await base64ToFile(file.base64, file.mimeType, `file-${Date.now()}.png`)

                try {
                    
                    
                    const [uploaded] = await utapi.uploadFiles([readableFile])

                    if(!uploaded.data) return

                    await saveFile({
                        fileUrl: uploaded.data.ufsUrl,
                        mimeType: file.mimeType
                    })

                    return {
                        fileUrl: uploaded.data.ufsUrl,
                        mimeType: file.mimeType,
                    }
                } catch (error) {
                    console.log(error)
                }

            }
        }
        }
          })


export const generateQuery = tool({
    description: "Generated postgresql queries based on user input",
    parameters: z.object({
        prompt: z.string().describe("The prompt to generate an sql queries for")
    }),
    execute: async ({prompt}) =>    { 
        const result = await generateObject({
        model: google("gemini-2.0-flash"),
        system: POSTGRES_PROMPT, // SYSTEM PROMPT AS ABOVE - OMITTED FOR BREVITY
        prompt: `Generate the query necessary to retrieve the data the user wants: ${prompt}`,
        schema: z.object({
                query: z.string(),
            })        
        });
         return {
            query: result.object.query
         } 

    }
})