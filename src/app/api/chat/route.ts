import {  saveChat } from '@/ai/functions';
import { imageGenerationTool, weatherTool } from '@/ai/tools';
import { SYSTEM_PROMPT } from '@/prompt';
import { google } from '@ai-sdk/google';
import { appendResponseMessages, streamText, smoothStream } from 'ai';

export const runtime = "edge"


export async function POST(req: Request) {
  const { messages, id, data } = await req.json();


  if(data?.imageUrl) {
    console.log(data.imageUrl)
  }

  const initialMessages = messages.slice(0, -1);
  const currentMessage = messages[messages.length - 1];

  const result = await streamText({
    model: google("gemini-2.5-flash", {
      // useSearchGrounding: true,
    }),
    system: SYSTEM_PROMPT,
    tools: {
      weather: weatherTool,
      imageGenerator: imageGenerationTool({
        id,
        messages
      })
  },
    messages: data ? [
      ...initialMessages,
      {
        role: 'user',
        content: [
          {
            type: 'text', text: currentMessage.content
          },
          {
            type: "image", image: new URL(data.imageUrl)
          }
        ]
      }
    ] : messages,
    experimental_transform: smoothStream({
      chunking: "word",
      delayInMs: 50
    }),
    async onError({error}) {
      console.log(error)
    },
    async onFinish({ response, toolCalls }) {

      const noToolWasCalled = !toolCalls || toolCalls.length === 0;


      if(noToolWasCalled) {
        await saveChat({
          id,
          messages: appendResponseMessages({
            messages,
            responseMessages: response.messages,
          }),
        });
      }
    },
  });
  return result.toDataStreamResponse();
}