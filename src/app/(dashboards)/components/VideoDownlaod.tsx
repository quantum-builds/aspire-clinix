"use client";

interface VideoDownloadProps {
  video: string;
  fileName?: string;
  trigger: React.ReactNode;
}

export function VideoDownload({
  video,
  fileName,
  trigger,
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

  return <button onClick={handleDownload}>{trigger}</button>;
}
