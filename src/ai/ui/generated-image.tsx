import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DownloadIcon, Loader2 } from "lucide-react";
import Image from "next/image";

interface Props {
  base64?: string;
  fileUrl?: string;
  mimeType: string;
}

export const GeneratedImage = ({ base64, mimeType, fileUrl }: Props) => {
  const [loading, setLoading] = useState(true);

  const handleDownload = () => {
    const link = document.createElement("a");
    if (base64) {
      link.href = `data:${mimeType};base64,${base64}`;
    } else if (fileUrl) {
      link.href = fileUrl;
    }
    link.download = "generated-image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const imageSrc = base64 ? `data:image/png;base64,${base64}` : fileUrl || "";

  if (!imageSrc) return null;

  return (
    <div className="relative h-[400px] w-[400px]">
      {!loading && (
        <Button
          variant={"ghost"}
          size="icon"
          onClick={handleDownload}
          className="absolute z-50 text-primary top-2 right-2 bg-white/80! hover:bg-white/40 hover:text-primary! cursor-pointer rounded-full"
        >
          <DownloadIcon className="size-4" />
        </Button>
      )}

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20 rounded-lg z-40">
          <Loader2 className="animate-spin size-6 text-muted-foreground" />
        </div>
      )}

      <Image
        src={imageSrc}
        alt="Generated image"
        width={500}
        height={500}
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
        className={`rounded-lg border border-muted w-[400px] aspect-auto transition-opacity duration-300 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
};
