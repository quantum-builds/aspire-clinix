"use client";

interface VideoDownloadProps {
  video: string;
  fileName?: string;
  text: string
}

export function VideoDownload({
  video,
  fileName,
  text,
}: VideoDownloadProps) {
  const handleDownload = async () => {
    const response = await fetch(video);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || "video.mp4";
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  };

  return <button className="bg-green text-white px-6 py-3 h-[60px] rounded-full border border-white shadow hover:bg-greenHover transition" onClick={handleDownload}>{text}</button>;
}
