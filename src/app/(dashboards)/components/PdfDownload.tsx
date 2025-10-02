"use client";

interface PdfDownloadProps {
  pdf: string;
  fileName?: string;
  trigger: React.ReactNode;
}

export function PdfDownload({ pdf, trigger, fileName }: PdfDownloadProps) {
  const handleDownload = async () => {
    const response = await fetch(pdf);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || "document.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  };

  return <button onClick={handleDownload}>{trigger}</button>;
}
