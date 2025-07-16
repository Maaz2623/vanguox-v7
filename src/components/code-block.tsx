import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string; // e.g. "language-ts"
}

export const CodeBlock = ({ children, className }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const language =
    className
      ?.split(" ")
      .find((cls) => cls.startsWith("language-"))
      ?.replace("language-", "") || "text";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(String(children));
    setCopied(true);
    setTimeout(() => setCopied(false), 4000);
  };

  return (
    <div className="relative group my-4">
      <div className="flex justify-between items-center px-4 py-2 text-xs font-mono bg-neutral-300 dark:bg-neutral-700 text-muted-foreground rounded-t-md">
        <span className="capitalize">{language}</span>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-neutral-400/20 dark:hover:bg-neutral-600"
          onClick={handleCopy}
        >
          {copied ? <CheckIcon /> : <CopyIcon className="size-4" />}
        </Button>
      </div>

      <pre className="scrollbar-thin px-6 py-4 overflow-x-auto bg-neutral-200 dark:bg-neutral-800 text-sm rounded-b-md">
        <code className={cn(className)}>{children}</code>
      </pre>
    </div>
  );
};
