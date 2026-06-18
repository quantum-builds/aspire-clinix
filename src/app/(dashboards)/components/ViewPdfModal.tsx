"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PdfModalProps {
  pdfUrl: string;
  trigger?: React.ReactNode;
}

export default function PdfModal({ pdfUrl, trigger }: PdfModalProps) {
  const [loading, setLoading] = useState(false);
  const [resolvedUrl, setResolvedUrl] = useState("");
  const [resolveError, setResolveError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  async function handleOpen(e: React.MouseEvent) {
    e.preventDefault();
    setLoading(true);
    setResolveError("");

    if (!pdfUrl) {
      setResolvedUrl("");
      setResolveError("Document not available.");
      setLoading(false);
      setIsOpen(true);
      return;
    }

    if (
      pdfUrl.startsWith("http://") ||
      pdfUrl.startsWith("https://") ||
      pdfUrl.startsWith("blob:") ||
      pdfUrl.startsWith("data:")
    ) {
      const ext = pdfUrl.toLowerCase().split(/[#?]/)[0].split(".").pop() || "";
      setResolvedUrl(pdfUrl);
      setLoading(false);

      if (ext === "docx" || ext === "doc") {
        window.open(
          `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`,
          "_blank"
        );
        return;
      }

      setIsOpen(true);
      return;
    }

    try {
      const endpoint = `/api/s3-file?fileName=${decodeURIComponent(pdfUrl)}`;
      const response = await fetch(endpoint, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Unable to resolve document (${response.status})`);
      }

      const data = await response.json();
      const fileInfo = data?.files?.[0];
      const fileUrl = fileInfo?.url;

      if (!fileUrl) {
        throw new Error("Document URL not found");
      }

      setResolvedUrl(fileUrl);
      setLoading(false);

      if (fileInfo?.type === "word") {
        window.open(
          `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`,
          "_blank"
        );
        return;
      }

      setIsOpen(true);
    } catch {
      setResolvedUrl("");
      setResolveError("Document could not be loaded.");
      setLoading(false);
      setIsOpen(true);
    }
  }

  return (
    <>
      {trigger ? (
        <span onClick={handleOpen} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") handleOpen(e as any); }}>
          {trigger}
        </span>
      ) : (
        <Button
          variant="ghost"
          className="underline text-green"
          onClick={handleOpen}
        >
          {loading ? "Loading..." : "See Document"}
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[1000px] h-[90vh]">
          <div className="rounded-md w-full h-full overflow-hidden relative bg-white">
            {resolveError && (
              <div className="absolute inset-0 flex items-center justify-center bg-white p-6 text-center">
                <div className="space-y-2 max-w-sm">
                  <p className="text-lg font-semibold text-dashboardTextBlack">
                    {resolveError}
                  </p>
                </div>
              </div>
            )}

            {!resolveError && resolvedUrl && (
              <div className="max-w-[900px] h-[90vh]">
                <iframe
                  src={resolvedUrl || undefined}
                  className="w-full h-full"
                  title="Document preview"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
