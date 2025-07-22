"use server"
import { db } from '@/db'; // your drizzle db instance
import { chatsTable, filesTable } from '@/db/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { messagesTable } from '@/db/schema'; // assumes you have a messages table
import { eq } from 'drizzle-orm';
import { Message } from 'ai'; // `Message` type from AI SDK (role/content)

export async function createChat(): Promise<string> {

    const data = await auth.api.getSession({
        headers: await headers()
    })

    if(!data) {
        throw new Error('Unauthorized')
    }

  const [newChat] = await db.insert(chatsTable).values({
    title: "Untitled",
    userId: data.user.id
  }).returning()

  return newChat.id;
}



export async function loadChat(chatId: string): Promise<Message[]> {
  const rows = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.chatId, chatId))
    .orderBy(messagesTable.createdAt);

  return rows.map((row) => ({
    ...row.message,
    id: row.id
  }))
}

export async function saveFile({
  mimeType,
  fileUrl
}: {
  fileUrl: string;
  mimeType: string;
}) {
  try {
     const data = await auth.api.getSession({
        headers: await headers()
    })

    if(!data) {
        throw new Error('Unauthorized')
    }

    await db.insert(filesTable).values({
      userId: data.user.id,
      mimeType,
      fileUrl
    })
  } catch (error) {
    console.log(error)
  }
}

export async function saveChat({
  chatId,
  messages,
}: {
  chatId: string
  messages: Message[];
}): Promise<void> {
  try {
    // 3. Insert only new messages
    await db.insert(messagesTable).values(
      messages.map((msg) => ({
        message: {
          ...msg,
          id: msg.id,
        },
        chatId,
      }))
    );
  } catch (error) {
    console.error('Failed to save chat:', error);
  }
}


export async function base64ToFile(base64: string, mimeType: string, filename: string): Promise<File> {
  const byteString = atob(base64);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const intArray = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i);
  }
  return new File([intArray], filename, { type: mimeType });
}

