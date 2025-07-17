import { ImageIcon } from "lucide-react";

export const ImageGenerating = () => {
  return (
    <div className="w-[400px] px-6 py-4 animate-pulse rounded-lg gap-x-1 border flex justify-start items-center">
      <ImageIcon />
      <p>Generating Image</p>
    </div>
  );
};
