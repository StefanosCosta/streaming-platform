'use client';

import { StreamingContent } from '@/types/content';
import ContentCard from '../ContentCard/ContentCard';

interface WatchHistoryProps {
  content: StreamingContent[];
  watchProgress: Map<string, number>;
  onContentClick: (content: StreamingContent) => void;
}

export default function WatchHistory({
  content,
  watchProgress,
  onContentClick,
}: WatchHistoryProps) {
  // Filter content that has watch progress
  const watchedContent = content.filter(
    (item) => (watchProgress.get(item.id) || 0) > 0,
  );

  if (watchedContent.length === 0) {
    return null;
  }

  return (
    <div className="px-8 py-4">
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
        Continue Watching
      </h2>
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {watchedContent.map((item) => (
          <ContentCard
            key={item.id}
            content={item}
            watchProgress={watchProgress.get(item.id) || 0}
            onClick={() => onContentClick(item)}
          />
        ))}
      </div>
    </div>
  );
}