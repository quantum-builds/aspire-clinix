"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Image, { StaticImageData } from "next/image";

interface VideoModalProps {
  video: string;
  thumbnail?: StaticImageData; // optional now
  trigger?: React.ReactNode; // ✅ custom trigger like PdfModal
}

export function VideoModal({ video, thumbnail, trigger }: VideoModalProps) {
  const [loading, setLoading] = useState(true);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : thumbnail ? (
          <Button variant="ghost" className="p-0 w-full h-full">
            <Image
              src={thumbnail}
              alt="Video Thumbnail"
              width={300}
              height={200}
              className="rounded-md w-full h-full object-cover"
            />
          </Button>
        ) : (
          <Button variant="ghost" className="underline text-green">
            See Video
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[800px]">
        <div className="rounded-md w-full aspect-video overflow-hidden relative bg-black">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
              <Loader2 className="w-10 h-10 animate-spin text-white" />
            </div>
          )}
          <video
            controls
            className="h-full w-full"
            onLoadedData={() => setLoading(false)}
          >
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </DialogContent>
    </Dialog>
  );
}
