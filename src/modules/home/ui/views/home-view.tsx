"use client";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import TextAreaAutoSize from "react-textarea-autosize";

export const HomeView = () => {
  return (
    <div className="bg-sidebar h-screen flex flex-col justify-center items-center">
      <div className="flex flex-col gap-y-4 text-center -mt-20 justify-center items-center">
        <Image src={`/logo.svg`} alt="logo" width={100} height={100} />
        <h1 className="text-4xl font-semibold">Vanguox AI</h1>
        <p className="text-md text-muted-foreground">
          A powerful AI system designed to enhance ideas and streamline
          creation.
        </p>
      </div>
      <Form />
    </div>
  );
};

const Form = () => {
  const [input, setInput] = useState("");

  const router = useRouter();

  const onSubmit = () => {
    router.replace(`/auth`);
  };

  return (
    <div className="w-full mt-10">
      <div className="rounded-lg w-[98%] lg:w-1/2 mx-auto bg-neutral-200 dark:bg-neutral-800 border dark:border-neutral-700 border-neutral-300 overflow-hidden p-2">
        <form onSubmit={onSubmit}>
          <TextAreaAutoSize
            minRows={1}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxRows={1}
            className="px-3 py-3 resize-none text-sm border-none w-full outline-none bg-transparent"
            placeholder="What would you like to build?"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (e.shiftKey) {
                  // Allow newline (default behavior)
                  return;
                } else {
                  e.preventDefault();
                  if (e.ctrlKey || !e.metaKey) {
                    onSubmit();
                  }
                }
              }
            }}
          />

          <div className="h-8 flex justify-between items-center">
            <div />
            <Button size={`icon`} type="submit">
              <ArrowUpIcon />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
