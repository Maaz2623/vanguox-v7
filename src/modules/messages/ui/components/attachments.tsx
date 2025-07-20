import { Button } from "@/components/ui/button";
import { CheckCircleIcon, Loader2Icon, XIcon } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { useUploadThing } from "@/lib/uploadthing";

interface Props {
  files: FileList | undefined;
  setFiles: Dispatch<SetStateAction<FileList | undefined>>;
  startUpload: ReturnType<typeof useUploadThing>["startUpload"];
  isUploading: ReturnType<typeof useUploadThing>["isUploading"];
}

export const Attachments = ({
  files,
  setFiles,
  startUpload,
  isUploading,
}: Props) => {
  const uploadedFilesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    const newFiles = fileArray.filter((file) => {
      const key = `${file.name}-${file.size}-${file.lastModified}`;
      return !uploadedFilesRef.current.has(key);
    });

    if (newFiles.length === 0) return;

    newFiles.forEach((file) => {
      const key = `${file.name}-${file.size}-${file.lastModified}`;
      uploadedFilesRef.current.add(key);
    });

    startUpload(newFiles)
      .then((res) => {
        console.log("Upload result:", res);
      })
      .catch((err) => {
        console.error("Upload failed:", err);
      });
  }, [files, startUpload]);

  return (
    <>
      <div className="px-3 py-2 bg-card rounded-t-lg w-[98%] mx-auto flex justify-between items-center">
        <Button
          size={`sm`}
          variant={`link`}
          className="text-sm cursor-pointer "
        >
          {files &&
            Array.from(files).map((file, idx) => (
              <div key={idx} className="flex gap-x-2">
                {isUploading ? (
                  <Loader2Icon className="text-neutral-500 animate-spin" />
                ) : (
                  <CheckCircleIcon className="text-green-500" />
                )}
                {file.name}
              </div>
            ))}
        </Button>
        <Button
          variant={`ghost`}
          className="h-5 w-5"
          onClick={() => setFiles(undefined)}
        >
          <XIcon className="size-4" />
        </Button>
      </div>
    </>
  );
};
