'use client';

import { StreamingContent } from '@/types/content';
import { useEffect, useRef } from 'react';

interface ContentModalProps {
  content: StreamingContent | null;
  onClose: () => void;
  onPlay?: (content: StreamingContent) => void;
}

export default function ContentModal({
  content,
  onClose,
  onPlay,
}: Readonly<ContentModalProps>) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (content) {
      // Focus the close button when modal opens
      closeButtonRef.current?.focus();

      // Lock body scroll
      document.body.style.overflow = 'hidden';

      // Handle escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);

      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [content, onClose]);

  if (!content) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl bg-gray-900 rounded-lg overflow-hidden shadow-2xl animate-scale-in"
      >
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center transition-all"
          aria-label="Close modal"
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

        {/* Hero Image */}
        <div className="relative h-96 bg-gradient-to-t from-gray-900">
          <img
            src={content.thumbnailUrl}
            alt={content.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

          {/* Play Button */}
          <div className="absolute bottom-8 left-8 flex items-center space-x-4">
            <button
              onClick={() => onPlay?.(content)}
              className="flex items-center space-x-2 bg-white hover:bg-opacity-80 transition-all px-8 py-3 rounded font-semibold text-black"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              <span>Play</span>
            </button>

            <button
              className="w-12 h-12 bg-gray-800 bg-opacity-70 hover:bg-opacity-90 rounded-full flex items-center justify-center transition-all"
              aria-label="Add to list"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content Info */}
        <div className="p-8 space-y-6">
          <div>
            <h2 id="modal-title" className="text-3xl font-bold text-white mb-4">
              {content.title}
            </h2>

            <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
              <span className="text-green-500 font-semibold">
                {Math.round(content.rating * 10)}% Match
              </span>
              <span>{content.year}</span>
              <span className="border border-gray-600 px-2 py-0.5 text-xs">
                HD
              </span>
              <span>{content.duration} min</span>
            </div>

            <p className="text-gray-300 leading-relaxed">{content.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-800">
            <div>
              <span className="text-gray-500">Genre: </span>
              <span className="text-white">{content.genre}</span>
            </div>

            <div>
              <span className="text-gray-500">Rating: </span>
              <span className="text-white flex items-center">
                <svg
                  className="w-4 h-4 text-yellow-500 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {content.rating.toFixed(1)}/10
              </span>
            </div>

            <div className="md:col-span-2">
              <span className="text-gray-500">Cast: </span>
              <span className="text-white">{content.cast.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}