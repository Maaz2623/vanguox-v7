import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import Image from "next/image";

interface Props {
  base64: string;
  fileUrl: string;
  mimeType: string;
}

export const GeneratedImage = ({ base64, mimeType }: Props) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `data:${mimeType};base64,${base64}`;
    link.download = "generated-image"; // Add appropriate file extension if needed
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative w-fit">
      <Button
        variant={"ghost"}
        size={`icon`}
        onClick={handleDownload}
        className="absolute z-50 text-primary top-2 right-2 bg-white/80! hover:bg-white/40 hover:text-primary! cursor-pointer rounded-full"
      >
        <DownloadIcon className="size-4" />
      </Button>
      <Image
        src={`data:image/png;base64,${base64}`}
        alt="Generated image"
        width={500}
        height={500}
        className="rounded-lg border border-muted w-[400px] aspect-auto"
      />
    </div>
  );
};
