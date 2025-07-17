import { google } from "@ai-sdk/google";
import { generateText, tool } from "ai";
import z from "zod";



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


export const imageGenerationTool = tool({
    description: "Generate an image from a prompt using Gemini",
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
            }
        })

        const image = result.files.find(file => file.mimeType.startsWith('image/'))


        if(!image) {
            return {
                message: "No message was generated"
            }
        }

        return {
            imageBase64: image.base64,
            mimeType: image.mimeType,
        }

    }
})