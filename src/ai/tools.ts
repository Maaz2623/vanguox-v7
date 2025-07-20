import { google } from "@ai-sdk/google";
import { appendResponseMessages, generateObject, generateText, tool } from "ai";
import z from "zod";
import { base64ToFile, saveChat, saveFile } from "./functions";
import { UTApi } from "uploadthing/server";
import { POSTGRES_PROMPT } from "@/prompt";


export const utapi = new UTApi({
  // ...options,
});



export const weatherTool = tool({
        description: "Get the weather in a given location. Only use this tool if the user is clearly asking for weather info.",      
        parameters: z.object({
            location: z.string().describe('The location to get the weather for'),
          }),
          execute: async ({ location }) => {
            const temperature = 10000
            return {
              location,
              temperature,
            };
          },
      })


export const imageGenerationTool = ({
  id,
  messages,
}: {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messages: any; // use correct type if available
}) => tool({
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
                    
                    await saveChat({
                        id,
                        messages: appendResponseMessages({
                            messages,
                            responseMessages: result.response.messages,
                        }),
                    });

                    if(!uploaded.data) return
                    
                    const uploadedFile = await saveFile(uploaded.data.ufsUrl, file.mimeType, result.response.messages[0].id)
                    

                    return {
                        fileUrl: uploadedFile.fileUrl,
                        mimeType: file.mimeType,
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        message: result.response.messages[0].content[1].text
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