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
  const imageUrl = searchParams.get("imageUrl");
  const filesParam = searchParams.get("files"); // assume this is a public file URL

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    addToolResult,
  } = useChat({
    id: chatId,
    initialMessages: initialMessages,
    sendExtraMessageFields: true, // send id and createdAt for each message
    // maxSteps: 5,
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
    async function fetchAndSubmit() {
      let fileList: FileList | undefined;

      if (filesParam) {
        try {
          const response = await fetch(filesParam);
          const blob = await response.blob();
          const filename = filesParam.split("/").pop() || "file";
          const file = new File([blob], filename, { type: blob.type });

          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileList = dataTransfer.files;
        } catch (error) {
          console.error("Failed to fetch file from URL:", error);
        }
      }

      if (initialMessage) {
        handleInputChange({
          target: { value: initialMessage },
        } as React.ChangeEvent<HTMLTextAreaElement>);

        handleSubmit(undefined, {
          experimental_attachments: fileList,
          data: imageUrl ? { imageUrl } : undefined,
        });

        const url = new URL(window.location.href);
        url.searchParams.delete("message");
        url.searchParams.delete("imageUrl");
        url.searchParams.delete("files");
        window.history.replaceState({}, "", url.toString());
      }
    }

    // only run when message is present
    if (initialMessage) {
      fetchAndSubmit();
    }
  }, [initialMessage, imageUrl, filesParam, handleInputChange, handleSubmit]);

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
              addToolResult={addToolResult}
              id={message.id}
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
                addToolResult={addToolResult}
                id={streamingMessage.id}
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
