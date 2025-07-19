import { MemoizedMarkdown } from "./memoized-markdown";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { GeneratedImage } from "@/ai/ui/generated-image";
import { ImageGenerating } from "@/ai/ui/image-generating";

export const DefaultMarkdown = ({
  id,
  content,
}: {
  id: string;
  content: string;
}) => {
  const trpc = useTRPC();

  const { data, isLoading } = useQuery(
    trpc.files.getFilesByMessageId.queryOptions({
      messageId: id,
    })
  );

  return (
    <div>
      <MemoizedMarkdown content={content} id="123456" />
      {!data
        ? null
        : data.map((file) => {
            if (file.mimeType.startsWith("image/")) {
              return (
                <GeneratedImage
                  fileUrl={file.fileUrl}
                  mimeType={file.mimeType}
                  key={file.id}
                />
              );
            }
          })}
    </div>
  );
};
