"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface PdfModalProps {
  pdfUrl: string;
  trigger?: React.ReactNode;
}

export default function PdfModal({ pdfUrl, trigger }: PdfModalProps) {
  const [loading, setLoading] = useState(true);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant="ghost" className="underline text-green">
            See Document
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[900px] h-[90vh]">
        <div className="rounded-md w-full h-full overflow-hidden relative bg-white">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/40">
              <Loader2 className="w-10 h-10 animate-spin text-white" />
            </div>
          )}

          <div className="max-w-[900px] h-[90vh]">
            <iframe
              src={pdfUrl}
              className="w-full h-full"
              onLoad={() => setLoading(false)}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
