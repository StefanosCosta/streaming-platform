'use client';

import { StreamingContent } from '@/types/content';
import ContentCard from '../ContentCard/ContentCard';
import { useRef, useState, useEffect } from 'react';

interface ContentGridProps {
  title: string;
  content: StreamingContent[];
  watchProgress?: Map<string, number>;
  onContentClick: (content: StreamingContent) => void;
}

export default function ContentGrid({
  title,
  content,
  watchProgress,
  onContentClick,
}: ContentGridProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [content]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (content.length === 0) {
    return null;
  }

  return (
    <div className="relative group/row">
      {/* Title */}
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 px-8">
        {title}
      </h2>

      {/* Scroll Left Button */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-40 w-12 bg-black bg-opacity-50 hover:bg-opacity-70 transition-all flex items-center justify-center opacity-0 group-hover/row:opacity-100"
          aria-label="Scroll left"
        >
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* Content Row */}
      <div
        ref={scrollContainerRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide px-8 scroll-smooth"
        onScroll={checkScroll}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {content.map((item) => (
          <ContentCard
            key={item.id}
            content={item}
            watchProgress={watchProgress?.get(item.id) || 0}
            onClick={() => onContentClick(item)}
          />
        ))}
      </div>

      {/* Scroll Right Button */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-40 w-12 bg-black bg-opacity-50 hover:bg-opacity-70 transition-all flex items-center justify-center opacity-0 group-hover/row:opacity-100"
          aria-label="Scroll right"
        >
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}
    </div>
  );
}