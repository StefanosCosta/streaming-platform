'use client';

import { StreamingContent } from '@/types/content';
import { useState } from 'react';

interface ContentCardProps {
  content: StreamingContent;
  watchProgress?: number;
  onClick: () => void;
}

export default function ContentCard({
  content,
  watchProgress = 0,
  onClick,
}: ContentCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="flex-shrink-0 w-72 cursor-pointer group relative"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Play ${content.title}`}
    >
      {/* Thumbnail */}
      <div className="relative h-40 bg-gray-800 rounded-lg overflow-hidden">
        {!imageError ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-700 animate-pulse" />
            )}
            <img
              src={content.thumbnailUrl}
              alt={content.title}
              className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <svg
              className="w-12 h-12 text-gray-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}

        {/* Watch Progress Bar */}
        {watchProgress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
            <div
              className="h-full bg-red-600 transition-all"
              style={{ width: `${watchProgress}%` }}
            />
          </div>
        )}

        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-14 h-14 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-black ml-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Hover Shadow Effect */}
        <div className="absolute inset-0 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Content Info */}
      <div className="mt-2 space-y-1">
        <h3 className="text-sm font-medium text-white truncate group-hover:text-red-500 transition-colors">
          {content.title}
        </h3>
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <span>{content.year}</span>
          <span>•</span>
          <span className="flex items-center">
            <svg
              className="w-3 h-3 text-yellow-500 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {content.rating.toFixed(1)}
          </span>
          <span>•</span>
          <span>{content.duration}m</span>
        </div>
        <p className="text-xs text-gray-500 truncate">{content.genre}</p>
      </div>
    </div>
  );
}