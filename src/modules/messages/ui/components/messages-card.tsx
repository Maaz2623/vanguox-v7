import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
// import { Typewriter } from "react-simple-typewriter";
import "highlight.js/styles/atom-one-dark.css"; // or any other theme like atom-one-dark
import { Button } from "@/components/ui/button";
import { CopyIcon, Share2Icon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";
import { MemoizedMarkdown } from "@/components/memoized-markdown";
import { useChat } from "@ai-sdk/react";
import { AnimatePresence, motion } from "framer-motion";
import { UIMessage } from "ai";
import { ImageGenerating } from "@/ai/ui/image-generating";

interface Props {
  role: UIMessage["role"];
  parts: UIMessage["parts"];
  status?: ReturnType<typeof useChat>["status"];
}

export const MessagesCard = ({ role, parts, status }: Props) => {
  return (
    <div className="">
      {role === "user" ? (
        <UserMessage parts={parts} />
      ) : (
        <AssistantMessage parts={parts} status={status} />
      )}
    </div>
  );
};

const UserMessage = ({ parts }: { parts: UIMessage["parts"] }) => {
  return (
    <AnimatePresence mode="wait" initial={true}>
      <motion.div
        className="w-full flex justify-end text-[15px] pr-4"
        key="user-message-card"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 10, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="shadow-none w-fit max-w-[60%] py-2 px-4 rounded-md! bg-primary/70 text-white border-primary/30">
          {Array.isArray(parts) &&
            parts.map((part, i) => {
              if (part.type === "text") {
                return <div key={i}>{part.text}</div>;
              }
              // Optional: fallback for other part types
              return null;
            })}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

interface AssistantMessagePros {
  parts: UIMessage["parts"];
  status?: ReturnType<typeof useChat>["status"];
}

export const AssistantMessage = React.memo(
  ({ parts, status }: AssistantMessagePros) => {
    return (
      <div
        className={cn("flex flex-col group px-2 pb-4 max-w-[90%] text-[16px]")}
      >
        <div className="flex items-center gap-2 mb-2">
          <Image
            src={`/logo.svg`}
            alt="vibe"
            width={18}
            height={18}
            className="shrink-0"
          />
          <span className="text-sm font-medium">Vanguox</span>
          <span className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 font-medium">
            {format(Date.now(), "HH:mm 'on' MM dd, yyyy")}
          </span>
        </div>

        <div className="w-full flex justify-start flex-col gap-y-2">
          <div
            className={cn(
              "shadow-none text-[15px] bg-transparent dark:bg-neutral-900 w-full p-5 border-none animate-fade-in max-w-full"
            )}
          >
            {parts.map((part, i) => {
              switch (part.type) {
                case "text":
                  return (
                    <MemoizedMarkdown key={i} content={part.text} id="123456" />
                  );

                case "tool-invocation":
                  switch (part.toolInvocation.toolName) {
                    case "weather": {
                      switch (part.toolInvocation.state) {
                        case "result": {
                          const responseText = `Temp in ${part.toolInvocation.result.location} is ${part.toolInvocation.result.temperature}`;
                          return (
                            <MemoizedMarkdown
                              key={i}
                              content={responseText}
                              id="123456"
                            />
                          );
                        }
                      }
                      break;
                    }
                    case "imageGenerator":
                      switch (part.toolInvocation.state) {
                        case "call":
                          return <ImageGenerating key={i} />;
                        case "result":
                          return (
                            <div key={i} className="mb-4">
                              <Image
                                src={`${part.toolInvocation.result.fileUrl}`}
                                alt="Generated image"
                                width={400}
                                height={400}
                                className="rounded-lg border border-muted"
                              />
                            </div>
                          );
                      }
                  }
                  break;
              }
            })}

            {/* )} */}
            <div
              className={cn(
                "h-7 -ml-2 flex opacity-0 justify-start items-center transition-all duration-300",
                status === "ready" && "opacity-100"
              )}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={`ghost`}
                    size={`icon`}
                    className="cursor-pointer p-0! rounded-[10px]!"
                  >
                    <CopyIcon className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy text</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={`ghost`}
                    size={`icon`}
                    className="cursor-pointer rounded-[10px]!"
                  >
                    <Share2Icon className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share link</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

AssistantMessage.displayName = "AssistantMessage";
