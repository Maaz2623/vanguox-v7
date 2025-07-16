"use client";

import { NewChatTemplateView } from "@/modules/messages/ui/views/new-chat-template-view";
import { usePathname } from "next/navigation";

export const ChatView = () => {
  const pathname = usePathname();

  return (
    <div className="border h-full relative">
      {pathname === "/" ? <NewChatTemplateView /> : "Messages List"}
    </div>
  );
};
