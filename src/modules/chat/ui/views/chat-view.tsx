"use client";

import { MessagesList } from "@/modules/messages/ui/components/messages-list";
import { Message } from "ai";

export const ChatView = ({
  chatId,
  initialMessages,
}: {
  chatId: string;
  initialMessages: Message[];
}) => {
  return (
    <div className="h-full relative">
      <MessagesList chatId={chatId} initialMessages={initialMessages} />
    </div>
  );
};
