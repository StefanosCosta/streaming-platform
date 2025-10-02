'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import ReactPlayer from 'react-player';
import { StreamingContent } from '@/types/content';

interface VideoPlayerProps {
  content: StreamingContent;
  initialProgress?: number;
  onClose: () => void;
  onProgress: (contentId: string, progress: number, immediate?: boolean) => void;
}

export default function VideoPlayer({
  content,
  initialProgress = 0,
  onClose,
  onProgress,
}: VideoPlayerProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(initialProgress > 0 ? initialProgress / 100 : 0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const lastUpdateTimeRef = useRef<number>(0);
  const hasSeekOnLoadRef = useRef<boolean>(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mediaQuery = window.matchMedia('(hover: none) and (pointer: coarse)');
      setIsMobile(mediaQuery.matches);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  // Auto-hide controls after 3 seconds of inactivity
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    // Only hide controls if video is playing
    if (playing) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [playing]);

  useEffect(() => {
    // Lock body scroll when player is open
    document.body.style.overflow = 'hidden';

    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === ' ') {
        e.preventDefault();
        setPlaying((prev) => !prev);
      }
    };

    // Handle fullscreen changes
    const handleFullscreenChange = () => {
      resetControlsTimeout();
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [resetControlsTimeout]);

  // Seek to initial progress when duration is loaded
  useEffect(() => {
    if (
      initialProgress > 0 &&
      duration > 0 &&
      playerRef.current &&
      !hasSeekOnLoadRef.current
    ) {
      const seekToTime = (initialProgress / 100) * duration;
      playerRef.current.currentTime = seekToTime;
      hasSeekOnLoadRef.current = true;
    }
  }, [duration, initialProgress]);

  // Show controls when paused
  useEffect(() => {
    if (!playing) {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    } else {
      resetControlsTimeout();
    }
  }, [playing, resetControlsTimeout]);

  // Handle mouse movement
  const handleMouseMove = useCallback(() => {
    resetControlsTimeout();
  }, [resetControlsTimeout]);

  // Handle video area click - different behavior for mobile vs desktop
  const handleVideoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isMobile) {
      // On mobile: just show controls, don't toggle play/pause
      resetControlsTimeout();
    } else {
      // On desktop: toggle play/pause
      setPlaying((prev) => !prev);
    }
  }, [isMobile, resetControlsTimeout]);

  // Handle double-click to toggle fullscreen
  const handleVideoDoubleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }, []);

  const handleClose = () => {
    // Save final progress before closing (immediately, not debounced)
    if (playerRef.current && duration > 0) {
      const currentProgress = playerRef.current.currentTime;
      const progressPercent = (currentProgress / duration) * 100;
      onProgress(content.id, progressPercent, true); // true = immediate sync
    }
    onClose();
  };

  const handleTimeUpdate = () => {
    if (!playing || seeking || !playerRef.current || duration <= 0) {
      return;
    }

    // Throttle updates to every 250ms
    const now = Date.now();
    if (now - lastUpdateTimeRef.current < 250) {
      return;
    }
    lastUpdateTimeRef.current = now;

    const currentTime = playerRef.current.currentTime;
    const playedFraction = currentTime / duration;
    setPlayed(playedFraction);

    // Save progress to parent component
    const progressPercent = playedFraction * 100;
    onProgress(content.id, progressPercent);
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    setSeeking(false);
    if (playerRef.current && duration > 0) {
      const seekValue = parseFloat((e.target as HTMLInputElement).value);
      playerRef.current.currentTime = seekValue * duration;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
    setMuted(false);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) {
      return '0:00';
    }
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-black select-none ${showControls ? 'cursor-default' : 'cursor-none'}`}
      role="dialog"
      aria-modal="true"
      aria-label="Video player"
      onMouseMove={handleMouseMove}
      onClick={handleMouseMove}
    >
      {/* Close Button */}
      <button
        onClick={handleClose}
        className={`absolute top-4 right-4 z-10 w-12 h-12 bg-black bg-opacity-70 hover:bg-opacity-90 rounded-full flex items-center justify-center transition-all duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="Close video player"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Video Player */}
      <div
        className="w-full h-full flex items-center justify-center relative select-none"
        onMouseMove={handleMouseMove}
        onClick={handleVideoClick}
        onDoubleClick={handleVideoDoubleClick}
      >
        <div style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
          <ReactPlayer
            ref={playerRef}
            src={content.videoUrl}
            playing={playing}
            volume={volume}
            muted={muted}
            width="100%"
            height="100%"
            onTimeUpdate={handleTimeUpdate}
            onDurationChange={() => {
              if (playerRef.current) {
                const dur = playerRef.current.duration;
                if (dur && !isNaN(dur)) {
                  setDuration(dur);
                }
              }
            }}
          />
        </div>
        {/* Transparent overlay to capture mouse events and toggle play/pause */}
        <div
          className={`absolute inset-0 select-none ${showControls ? 'pointer-events-none' : 'pointer-events-auto'}`}
          onMouseMove={handleMouseMove}
          onClick={handleVideoClick}
          onDoubleClick={handleVideoDoubleClick}
          style={{ background: 'transparent' }}
        />
      </div>

      {/* Custom Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bar */}
        <div className="mb-4">
          <input
            type="range"
            min={0}
            max={0.999999}
            step="any"
            value={played || 0}
            onMouseDown={handleSeekMouseDown}
            onChange={handleSeekChange}
            onMouseUp={handleSeekMouseUp}
            className="range-slider-progress"
            style={{ '--progress': `${(played || 0) * 100}%` } as React.CSSProperties}
            aria-label="Video progress"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(played * duration)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Play/Pause Button */}
            <button
              onClick={() => setPlaying(!playing)}
              className="w-10 h-10 flex items-center justify-center hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? (
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>

            {/* Volume Control */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="w-10 h-10 flex items-center justify-center hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
                aria-label={muted ? 'Unmute' : 'Mute'}
              >
                {muted || volume === 0 ? (
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={volume}
                onChange={handleVolumeChange}
                className="range-slider-volume"
                style={{ '--volume': `${volume * 100}%` } as React.CSSProperties}
                aria-label="Volume"
              />
            </div>
          </div>

          {/* Content Info */}
          <div className="flex-1 px-6">
            <h3 className="text-white font-semibold">{content.title}</h3>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={() => {
              if (document.fullscreenElement) {
                document.exitFullscreen();
              } else {
                document.documentElement.requestFullscreen();
              }
            }}
            className="w-10 h-10 flex items-center justify-center hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
            aria-label="Toggle fullscreen"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}