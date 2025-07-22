import { UIMessage } from "ai";
import { MemoizedMarkdown } from "./memoized-markdown";
import { GeneratedImage } from "@/ai/ui/generated-image";
import { ImageGenerating } from "@/ai/ui/image-generating";

export const DefaultMarkdown = ({
  id,
  parts,
}: {
  id: string;
  parts: UIMessage["parts"];
}) => {
  console.log(id);
  return (
    <div>
      {parts.map((part, i) => {
        switch (part.type) {
          case "text":
            return <MemoizedMarkdown key={i} content={part.text} id="123456" />;
          case "tool-invocation": {
            switch (part.toolInvocation.toolName) {
              case "imageGenerator": {
                switch (part.toolInvocation.state) {
                  case "call":
                    return (
                      <ImageGenerating key={part.toolInvocation.toolCallId} />
                    );
                  case "result":
                    const { fileUrl, mimeType } = part.toolInvocation.result;
                    return (
                      <GeneratedImage
                        key={part.toolInvocation.toolCallId}
                        fileUrl={fileUrl}
                        mimeType={mimeType}
                      />
                    );
                }
              }
            }
          }
        }
      })}
    </div>
  );
};
