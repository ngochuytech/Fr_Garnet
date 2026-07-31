import React, { useEffect, useRef, useState } from 'react';

const AutoPlayVideo = ({ src, className, controls = true }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true); // Always start muted for autoplay

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Play when visible
            if (videoRef.current) {
              videoRef.current.play().catch((err) => {
                console.log('Autoplay blocked or interrupted:', err);
              });
            }
          } else {
            // Pause when out of view
            if (videoRef.current) {
              videoRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% visible
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  const toggleMute = (e) => {
    e.stopPropagation(); // Prevent opening modal if placed in a clickable container
    e.preventDefault();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        src={src}
        controls={controls}
        muted={isMuted} // Controlled by state
        loop
        playsInline
        preload="metadata"
        className={className}
        onVolumeChange={(e) => {
            // Sync state if user changes volume via native controls
            if (e.target.muted !== isMuted) {
                setIsMuted(e.target.muted);
            }
        }}
      />
      {/* Custom Mute/Unmute Button Overlay */}
      <button
        onClick={toggleMute}
        className="absolute top-2 right-2 p-1.5 md:p-2 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors z-10"
        title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
      >
        {isMuted ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        )}
      </button>
    </div>
  );
};

export default AutoPlayVideo;
