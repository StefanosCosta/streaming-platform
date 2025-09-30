import { useState, useEffect, useCallback } from 'react';
import { WatchHistoryItem } from '@/types/content';

const WATCH_HISTORY_KEY = 'zenithflix_watch_history';

export function useWatchHistory() {
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load watch history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WATCH_HISTORY_KEY);
      if (stored) {
        setWatchHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load watch history:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save watch history to localStorage whenever it changes
  const saveToLocalStorage = useCallback((history: WatchHistoryItem[]) => {
    try {
      localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save watch history:', error);
    }
  }, []);

  // Update progress for a content item
  const updateProgress = useCallback(
    (contentId: string, progress: number) => {
      setWatchHistory((prev) => {
        const existing = prev.find((item) => item.contentId === contentId);

        let newHistory: WatchHistoryItem[];
        if (existing) {
          // Update existing entry
          newHistory = prev.map((item) =>
            item.contentId === contentId
              ? {
                  ...item,
                  progress,
                  lastWatched: new Date().toISOString(),
                }
              : item,
          );
        } else {
          // Add new entry
          newHistory = [
            ...prev,
            {
              contentId,
              progress,
              lastWatched: new Date().toISOString(),
            },
          ];
        }

        saveToLocalStorage(newHistory);
        return newHistory;
      });
    },
    [saveToLocalStorage],
  );

  // Get progress for a specific content item
  const getProgress = useCallback(
    (contentId: string): number => {
      const item = watchHistory.find((h) => h.contentId === contentId);
      return item?.progress || 0;
    },
    [watchHistory],
  );

  // Clear all watch history
  const clearHistory = useCallback(() => {
    setWatchHistory([]);
    localStorage.removeItem(WATCH_HISTORY_KEY);
  }, []);

  return {
    watchHistory,
    isLoading,
    updateProgress,
    getProgress,
    clearHistory,
  };
}