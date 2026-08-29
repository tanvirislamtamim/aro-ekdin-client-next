"use client";

import React, { useEffect, useRef } from 'react';
import { useElementOnScreen } from "../../hooks/useElementOnScreen";

interface AutoPlayVideoProps {
  videoSrc: string;
}

const AutoPlayVideo: React.FC<AutoPlayVideoProps> = ({ videoSrc }) => {
  const [containerRef, isVisible] = useElementOnScreen({ threshold: 0.5 });
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isVisible) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Autoplay blocked", error);
          });
        }
      } else {
        videoRef.current.pause();
      }
    }
  }, [isVisible]);

  return (
    <>
      <style>
        {`
          video::-webkit-media-controls-current-time-display,
          video::-webkit-media-controls-time-remaining-display {
            color: #ffffff !important;
          }

          video::-webkit-media-controls-timeline {
            filter: invert(1) brightness(10) !important;
          }

          video::-webkit-media-controls-overflow-button,
          video::-internal-media-controls-overflow-button,
          video::-webkit-media-controls-panel-menu-button {
            filter: brightness(0) invert(1) !important;
            -webkit-filter: brightness(0) invert(1) !important;
            display: block !important;
          }

          video::-webkit-media-controls-play-button,
          video::-webkit-media-controls-mute-button,
          video::-webkit-media-controls-fullscreen-button {
            filter: brightness(0) invert(1) !important;
          }

          video::-webkit-media-controls-panel {
            background-image: linear-gradient(transparent, rgba(0, 0, 0, 0.6)) !important;
            display: flex !important;
          }

          video::-webkit-media-controls-enclosure {
            overflow: visible !important;
          }
        `}
      </style>

      <div
        ref={containerRef}
        className="w-full relative overflow-hidden md:h-screen"
      >
        <video
          ref={videoRef}
          src={videoSrc}
          loop
          playsInline
          muted
          controls
          className="w-full h-auto md:h-full object-cover"
        />

        {!isVisible && (
          <div className="absolute inset-0 backdrop-blur-[2px] pointer-events-none flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-white/40 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white font-medium tracking-widest uppercase text-xs">
                Experience Fullscreen
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AutoPlayVideo;
