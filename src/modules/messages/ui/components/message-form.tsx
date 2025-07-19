"use client";

import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import TextAreaAutoSize from "react-textarea-autosize";
import {
  ArrowUpIcon,
  Loader2Icon,
  PaperclipIcon,
  SquareIcon,
} from "lucide-react";
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
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const pathname = usePathname();

  const [isCreateChatPending, startCreateChatTransition] = useTransition();

  const router = useRouter();

  console.log(files);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pathname === "/") {
      startCreateChatTransition(async () => {
        const id = await createChat();
        const params = new URLSearchParams({ message: input });
        router.push(`/chats/${id}?${params.toString()}`);
      });
    } else {
      handleSubmit(e, {
        experimental_attachments: files,
      });
      setFiles(undefined);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      console.log(files);
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
            <form className="" onSubmit={onSubmit}>
              <div className="border">
                {files && files.length > 0 && (
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground px-2 flex">
                    {Array.from(files).map((file, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="font-medium">{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex">
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
              </div>
              <div className="h-8 flex justify-between items-center">
                <div className="w-fit">
                  <Button
                    variant={`secondary`}
                    size={`icon`}
                    type="button"
                    className="h-8 shadow-none w-8"
                    onClick={handleClick}
                  >
                    <PaperclipIcon className="size-4" />
                  </Button>
                </div>
                <Button
                  size="icon"
                  type="submit"
                  className="h-8 shadow-none w-8"
                >
                  {isCreateChatPending ? (
                    <Loader2Icon className="animate-spin size-4" />
                  ) : (
                    <>
                      {status === "ready" ? (
                        <ArrowUpIcon className="size-4" />
                      ) : (
                        <SquareIcon className="fill-white" />
                      )}
                    </>
                  )}
                </Button>
              </div>
            </form>

            <input
              type="file"
              className="hidden"
              onChange={(event) => {
                if (event.target.files) {
                  setFiles(event.target.files);
                }
              }}
              multiple
              ref={fileInputRef}
            />
          </fieldset>
        </div>
      </div>
    </motion.div>
  );
};
