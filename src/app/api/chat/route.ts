import { saveChat } from '@/ai/functions';
import { google } from '@ai-sdk/google';
import { appendResponseMessages, streamText, smoothStream } from 'ai';



export async function POST(req: Request) {
  const { messages, id } = await req.json();

  const result = await streamText({
    model: google("gemini-2.0-flash", {
      useSearchGrounding: true
    }),
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