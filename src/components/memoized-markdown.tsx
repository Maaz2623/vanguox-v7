import { marked } from "marked";
import { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { CodeBlock } from "./code-block";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";

function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown);
  return tokens.map((token) => token.raw);
}

const MemoizedMarkdownBlock = memo(
  ({ content }: { content: string }) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          h1: (props) => <h1 className="text-2xl font-bold mb-4" {...props} />,
          h2: (props) => (
            <h2 className="text-xl font-semibold mb-4" {...props} />
          ),
          h3: (props) => (
            <h3 className="text-lg font-semibold mb-4" {...props} />
          ),
          ul: (props) => (
            <ul className="list-disc pl-6 space-y-1 mb-4" {...props} />
          ),
          ol: (props) => (
            <ol
              className="list-decimal pl-6 mb-2 [&>li]:mb-1 [&>li>ol]:list-[lower-alpha] [&>li>ol]:pl-6 [&>li>ol>li>ol]:list-[lower-roman] [&>li>ol>li>ol]:pl-6"
              {...props}
            />
          ),
          li: (props) => <li className="ml-1" {...props} />,

          p: (props) => <p className="mb-4 leading-6" {...props} />,
          strong: (props) => <strong className="font-semibold" {...props} />,
          code: ({ className, children }) => {
            const isBlock = className?.includes("language-"); // <--- detect block code

            if (isBlock) {
              return <CodeBlock className={className}>{children}</CodeBlock>;
            }

            // Inline code (rendered inside <p>)
            return (
              <code className="bg-neutral-300 transition-all duration-500 dark:bg-neutral-700 px-1 py-0.5 mx-auto rounded text-[14px] font-mono">
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.content !== nextProps.content) return false;
    return true;
  }
);

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock";

export const MemoizedMarkdown = memo(
  ({ content, id }: { content: string; id: string }) => {
    const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);

    return blocks.map((block, index) => (
      <MemoizedMarkdownBlock content={block} key={`${id}-block_${index}`} />
    ));
  }
);

MemoizedMarkdown.displayName = "MemoizedMarkdown";
