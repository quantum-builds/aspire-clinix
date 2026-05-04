"use client";

interface PdfDownloadProps {
  pdf: string;
  text: string
  fileName?: string;
}

export function PdfDownload({ pdf, text, fileName }: PdfDownloadProps) {
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

  return <button className="bg-green text-white px-6 py-3 h-[60px] rounded-full border border-white shadow  hover:bg-greenHover transition" onClick={handleDownload}>{text}</button>;
}
