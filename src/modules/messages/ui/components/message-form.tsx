"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState } from "react";
import TextAreaAutoSize from "react-textarea-autosize";
import { ArrowUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const MessageForm = () => {
  const pathname = usePathname();
  const [input, setInput] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // handle input submission
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
          <form onSubmit={onSubmit}>
            <TextAreaAutoSize
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="px-3 py-3 resize-none text-sm border-none w-full outline-none bg-transparent"
              placeholder="What would you like to build?"
            />
            <div className="h-8 flex justify-between items-center">
              <div />
              <Button size="icon" type="submit">
                <ArrowUpIcon />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};
