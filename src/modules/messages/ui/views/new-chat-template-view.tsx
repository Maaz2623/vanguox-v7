"use client";
import { useChat } from "@ai-sdk/react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { MessageForm } from "../components/message-form";

export const NewChatTemplateView = () => {
  const { handleInputChange, handleSubmit, input, status } = useChat();

  return (
    <div>
      <AnimatePresence mode="wait" initial={true}>
        <motion.div
          key="new-messages-view-logo"
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-[300px] flex flex-col justify-center mt-10 items-center text-center"
        >
          <Image src="/logo.svg" alt="logo" width={100} height={100} priority />
          <h1 className="text-4xl font-semibold mt-4">Vanguox AI</h1>
          <p className="text-md text-muted-foreground mt-2">
            A powerful AI system designed to enhance ideas and streamline
            creation.
          </p>
        </motion.div>
      </AnimatePresence>
      <MessageForm
        status={status}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};
