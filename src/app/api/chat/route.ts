import {  saveChat } from '@/ai/functions';
import { imageGenerationTool, generateQuery } from '@/ai/tools';
import { SYSTEM_PROMPT } from '@/prompt';
import { google } from '@ai-sdk/google';
import { appendResponseMessages, streamText, smoothStream, UIMessage, CoreMessage } from 'ai';

export const runtime = "edge"


export async function POST(req: Request) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { messages, id, data }: {messages: UIMessage[], id: any, data: any} = await req.json();

  const initialMessages = messages.slice(0, -1);
  const currentMessage = messages[messages.length - 1];

  const result = await streamText({
    model: google("gemini-2.5-flash", {
    }),
    system: SYSTEM_PROMPT,
    // toolCallStreaming: true,
    tools: {
      queryGenerator: generateQuery,
      imageGenerator: imageGenerationTool()
  },
    messages: data ? [
      ...initialMessages as CoreMessage[],
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
    async onFinish({ response,  }) {
      const lastUserMessage = messages.slice(-1);


       await saveChat({
        chatId: id,
        messages: appendResponseMessages({
          messages: lastUserMessage,
          responseMessages: response.messages
        })
      })
    },
  });
  return result.toDataStreamResponse();
}