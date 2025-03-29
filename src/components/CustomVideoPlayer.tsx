"use client";
import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const CustomVideoPlayer = ({ src }: { src: string }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      const player = videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        fluid: true,
      });

      return () => {
        player.dispose();
      };
    }
  }, []);

  return (
    <video
      ref={videoRef}
      className="video-js vjs-theme-city w-full h-full xl:w-[900px] xl:h-[400px] p-8 lg:p-0"
      src={src}
    ></video>
  );
};

export default CustomVideoPlayer;
