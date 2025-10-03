'use client';

import { StreamingContent, WatchHistoryItem } from '@/types/content';
import ContentCard from '../ContentCard/ContentCard';

interface WatchHistoryProps {
  content: StreamingContent[];
  watchHistory: WatchHistoryItem[];
  onContentClick: (content: StreamingContent) => void;
}

export default function WatchHistory({
  content,
  watchHistory,
  onContentClick,
}: Readonly<WatchHistoryProps>) {
  // Filter and sort content by most recently watched
  const watchedContent = content
    .filter((item) => {
      const historyItem = watchHistory.find((h) => h.contentId === item.id);
      return historyItem && historyItem.progress > 0;
    })
    .sort((a, b) => {
      const aHistory = watchHistory.find((h) => h.contentId === a.id);
      const bHistory = watchHistory.find((h) => h.contentId === b.id);

      if (!aHistory || !bHistory) return 0;

      // Sort by lastWatched descending (most recent first)
      return new Date(bHistory.lastWatched).getTime() - new Date(aHistory.lastWatched).getTime();
    });

  if (watchedContent.length === 0) {
    return null;
  }

  // Create progress map for ContentCard
  const watchProgressMap = new Map<string, number>();
  watchHistory.forEach((item) => {
    watchProgressMap.set(item.contentId, item.progress);
  });

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
            watchProgress={watchProgressMap.get(item.id) || 0}
            onClick={() => onContentClick(item)}
          />
        ))}
      </div>
    </div>
  );
}