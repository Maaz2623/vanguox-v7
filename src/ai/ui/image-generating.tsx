import { ImageIcon, Loader2Icon } from "lucide-react";

export const ImageGenerating = () => {
  return (
    <div className="w-[400px] h-[400px] bg-neutral-800 border border-neutral-700 animate-pulse rounded-lg flex justify-center items-center">
      <div className="relative size-10 flex justify-center items-center">
        <Loader2Icon className="h-full w-full animate-spin text-muted-foreground" />
        <ImageIcon className="absolute top-1/2 left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>
  );
};
