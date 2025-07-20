"use client";
import { Input } from "@/components/ui/input";
import { useChat } from "@ai-sdk/react";
import React from "react";
import { QueriedData } from "./queried-data";

const TestPage = () => {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div>
      {messages.map((msg) => {
        return (
          <div key={msg.id}>
            {msg.parts.map((part, i) => {
              switch (part.type) {
                case "text":
                  return <div key={i}>{part.text}</div>;
                case "tool-invocation":
                  switch (part.toolInvocation.toolName) {
                    case "queryGenerator":
                      switch (part.toolInvocation.state) {
                        case "result":
                          return (
                            <div key={i}>
                              <pre>{part.toolInvocation.result.query}</pre>
                              <QueriedData
                                query={part.toolInvocation.result.query}
                              />{" "}
                            </div>
                          );
                      }
                  }
              }
            })}
          </div>
        );
      })}

      <form className="mt-10" onSubmit={handleSubmit}>
        <Input value={input} type="text" onChange={handleInputChange} />
      </form>
    </div>
  );
};

export default TestPage;
