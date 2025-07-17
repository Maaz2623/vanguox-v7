import { saveChat } from '@/ai/functions';
import { SYSTEM_PROMPT } from '@/prompt';
import { google } from '@ai-sdk/google';
import { appendResponseMessages, streamText, smoothStream, tool } from 'ai';
import z from 'zod';


export const runtime = 'edge'; // ✅ run this function at the edge


export async function POST(req: Request) {
  const { messages, id } = await req.json();

  const result = await streamText({
    model: google("gemini-2.5-flash", {
      // useSearchGrounding: true,
    }),
    system: SYSTEM_PROMPT,
    tools: {
      weather: tool({
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
      }),
  },
    messages,
    experimental_transform: smoothStream({
      chunking: "word",
      delayInMs: 50
    }),
    async onFinish({ response }) {
        await saveChat({
          id,
          messages: appendResponseMessages({
            messages,
            responseMessages: response.messages,
          }),
        });
    },
  });
  return result.toDataStreamResponse();
}