import { saveChat } from '@/ai/functions';
import { imageGenerationTool, weatherTool } from '@/ai/tools';
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
      weather: weatherTool,
      imageGenerator: imageGenerationTool
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