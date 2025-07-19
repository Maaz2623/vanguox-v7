"use client";

import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import TextAreaAutoSize from "react-textarea-autosize";
import { ArrowUpIcon, Loader2Icon, PauseIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChat } from "@ai-sdk/react";
import { createChat } from "@/ai/functions";

type HandleSubmit = ReturnType<typeof useChat>["handleSubmit"];
type HandleInputChange = ReturnType<typeof useChat>["handleInputChange"];
type Input = ReturnType<typeof useChat>["input"];
type Status = ReturnType<typeof useChat>["status"];

interface Props {
  handleSubmit: HandleSubmit;
  handleInputChange: HandleInputChange;
  input: Input;
  status: Status;
}

export const MessageForm = ({
  handleSubmit,
  handleInputChange,
  input,
  status,
}: Props) => {
  const pathname = usePathname();

  const [isCreateChatPending, startCreateChatTransition] = useTransition();

  const router = useRouter();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pathname === "/") {
      startCreateChatTransition(async () => {
        const id = await createChat();
        const params = new URLSearchParams({ message: input });
        router.push(`/chats/${id}?${params.toString()}`);
      });
    } else {
      handleSubmit();
      console.log(input);
    }
  };

  return (
    <motion.div
      layout
      initial={{
        bottom: pathname === "/" ? 12 : 150,
      }}
      animate={{ bottom: pathname === "/" ? 150 : 12 }}
      transition={{ duration: 0.3 }}
      className="w-full"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
      }}
    >
      <div className="w-2/3 mx-auto">
        <div className="rounded-lg w-full mx-auto bg-neutral-200 dark:bg-neutral-800 border dark:border-neutral-700 border-neutral-300 overflow-hidden p-2">
          <fieldset disabled={status !== "ready" || isCreateChatPending}>
            <form onSubmit={onSubmit}>
              <TextAreaAutoSize
                rows={1}
                value={input}
                onChange={handleInputChange}
                className="px-3 py-3 resize-none text-sm border-none w-full outline-none bg-transparent"
                placeholder="What would you like to build?"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (e.shiftKey) return; // Allow newline
                    e.preventDefault();
                    if (e.ctrlKey || !e.metaKey) {
                      onSubmit(e);
                    }
                  }
                }}
              />
              <div className="h-8 flex justify-between items-center">
                <div />
                <Button size="icon" type="submit">
                  {isCreateChatPending ? (
                    <Loader2Icon className="animate-spin size-4" />
                  ) : (
                    <>{status === "ready" ? <ArrowUpIcon /> : <PauseIcon />}</>
                  )}
                </Button>
              </div>
            </form>
          </fieldset>
        </div>
      </div>
    </motion.div>
  );
};
