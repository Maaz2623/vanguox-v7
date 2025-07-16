import { loadChat } from "@/ai/functions";
import { ChatView } from "@/modules/chat/ui/views/chat-view";
import React from "react";

interface Props {
  params: Promise<{
    chatId: string;
  }>;
}

const ChatIdPage = async ({ params }: Props) => {
  const { chatId } = await params;

  const messages = await loadChat(chatId);

  return <ChatView chatId={chatId} initialMessages={messages} />;
};

export default ChatIdPage;
