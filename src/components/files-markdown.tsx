import { getFileByMessage } from "@/ai/functions";
import { MemoizedMarkdown } from "./memoized-markdown";

export const DefaultMarkdown = ({
  id,
  content,
}: {
  id: string;
  content: string;
}) => {
  return (
    <div>   
      <MemoizedMarkdown content={content} id="123456" />
    </div>
  );
};
