"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface PdfModalProps {
  pdfUrl: string;
  trigger?: React.ReactNode;
}

export default function PdfModal({ pdfUrl, trigger }: PdfModalProps) {
  const [loading, setLoading] = useState(true);
  const [resolvedPdfUrl, setResolvedPdfUrl] = useState<string>("");
  const [resolveError, setResolveError] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    async function resolvePdfUrl() {
      setLoading(true);
      setResolveError("");

      if (!pdfUrl) {
        setResolvedPdfUrl("");
        setResolveError("Document not available.");
        setLoading(false);
        return;
      }

      if (
        pdfUrl.startsWith("http://") ||
        pdfUrl.startsWith("https://") ||
        pdfUrl.startsWith("blob:") ||
        pdfUrl.startsWith("data:")
      ) {
        if (!cancelled) {
          setResolvedPdfUrl(pdfUrl);
          setLoading(false);
        }
        return;
      }

      try {
        const endpoint = `/api/s3-file?fileName=${encodeURIComponent(pdfUrl)}`;
        const response = await fetch(endpoint, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Unable to resolve document (${response.status})`);
        }

        const data = await response.json();
        const fileUrl = data?.files?.[0]?.url;

        if (!fileUrl) {
          throw new Error("Document URL not found");
        }

        if (!cancelled) {
          setResolvedPdfUrl(fileUrl);
          setLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          setResolvedPdfUrl("");
          setResolveError("Document could not be loaded.");
          setLoading(false);
        }
      }
    }

    resolvePdfUrl();

    return () => {
      cancelled = true;
    };
  }, [pdfUrl]);

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

      <DialogContent className="sm:max-w-[1000px] h-[90vh]">
        <div className="rounded-md w-full h-full overflow-hidden relative bg-white">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/40">
              <Loader2 className="w-10 h-10 animate-spin text-white" />
            </div>
          )}

          {resolveError && !loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white p-6 text-center">
              <div className="space-y-2 max-w-sm">
                <p className="text-lg font-semibold text-dashboardTextBlack">
                  {resolveError}
                </p>
                <p className="text-sm text-gray-500">
                  The stored document key may be missing or expired.
                </p>
              </div>
            </div>
          )}

          <div className="max-w-[900px] h-[90vh]">
            <iframe
              src={resolvedPdfUrl || undefined}
              className="w-full h-full"
              title="Referral document preview"
              onLoad={() => setLoading(false)}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
