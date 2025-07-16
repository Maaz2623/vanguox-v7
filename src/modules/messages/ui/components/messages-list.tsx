import { useChat } from "@ai-sdk/react";
import { Message } from "ai";
import { MessageForm } from "./message-form";
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessagesCard } from "./messages-card";
import { SyncLoader } from "react-spinners";

interface Props {
  chatId: string;
  initialMessages: Message[];
}

export const MessagesList = ({ chatId, initialMessages }: Props) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const initialMessage = searchParams.get("message");

  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    id: chatId,
    initialMessages: initialMessages,
    sendExtraMessageFields: true, // send id and createdAt for each message
  });

  const lastMessage = messages[messages.length - 1];
  const isLastMessageUser = lastMessage?.role === "user";

  const lastIndex = messages.length - 1;

  const streamingMessage =
    messages[lastIndex]?.role === "assistant" && status === "streaming"
      ? messages[lastIndex]
      : null;

  const stableMessages = streamingMessage ? messages.slice(0, -1) : messages;

  useEffect(() => {
    if (initialMessage) {
      handleInputChange({
        target: { value: initialMessage },
      } as React.ChangeEvent<HTMLTextAreaElement>);

      handleSubmit();

      // Optional: clean up the URL
      const url = new URL(window.location.href);
      url.searchParams.delete("message");
      window.history.replaceState({}, "", url.toString());
    }
  }, [initialMessage, handleSubmit, handleInputChange]);

  useEffect(() => {
    if (isLastMessageUser || status === "submitted") {
      const frame = requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      });

      return () => cancelAnimationFrame(frame);
    }

    if (!messages || messages.length === 0) return;

    if (status === "streaming") {
      return;
    }
  }, [messages.length, messages, status, isLastMessageUser]); // only when a new message is added

  return (
    <div>
      <ScrollArea className="h-[500px] w-full overflow-hidden relative">
        <div className=" bg-gradient-to-b z-50 from-neutral-100 dark:from-neutral-900 to-transparent h-6 w-full absolute top-0" />
        <div className="p-4 h-full w-2/3 mx-auto pt-10 pb-40 space-y-8">
          {stableMessages.map((message) => (
            <MessagesCard
              status={status}
              role={message.role}
              parts={message.parts}
              key={message.id}
            />
            // <div
            //   key={i}
            //   className="whitespace-pre-wrap transition-all duration-300"
            // >
            //   {Array.isArray(message.parts) &&
            //     message.parts.map((part, i) => {
            //       if (part.type === "text") {
            //         return <div key={i}>{part.text}</div>;
            //       }
            //       // Optional: fallback for other part types
            //       return null;
            //     })}
            // </div>
          ))}
          {status === "submitted" && (
            <div className="flex items-center justify-center size-10 m-2">
              <SyncLoader className="" size={6} color="#ffff" margin={2} />
            </div>
          )}
          {streamingMessage && (
            <div>
              <MessagesCard
                status={status}
                role={streamingMessage.role}
                parts={streamingMessage.parts}
                key={streamingMessage.id}
              />
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
      <MessageForm
        status={status}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};
