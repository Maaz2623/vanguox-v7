"use server"
import { db } from '@/db'; // your drizzle db instance
import { chatsTable } from '@/db/schema';
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



export async function loadChat(id: string): Promise<Message[]> {
  const rows = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.chatId, id))
    .orderBy(messagesTable.createdAt);

  return rows.map((msg) => ({
    id: msg.id,
    role: msg.role as "data" | "user" | "assistant" | "system",
    content: msg.content,
  }));
}

export async function saveChat({
  id: chatId,
  messages,
}: {
  id: string;
  messages: Message[];
}): Promise<void> {
  try {
    
    // Optional: clear previous messages for that chat
  await db.delete(messagesTable).where(eq(messagesTable.chatId, chatId));

  // Insert new messages
  await db.insert(messagesTable).values(
    messages.map((msg) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      chatId,
    }))
  );
} catch (error) {
  console.error(error)
}
}

