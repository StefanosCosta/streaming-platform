import { useState, useEffect, useCallback, useRef } from 'react';
import { WatchHistoryItem } from '@/types/content';

const WATCH_HISTORY_KEY = 'zenithflix_watch_history';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useWatchHistory() {
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const syncTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});

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
      setIsInitialized(true);
    }
  }, []);

  // Clean up debounce timers on unmount
  useEffect(() => {
    return () => {
      Object.values(syncTimeoutRef.current).forEach(clearTimeout);
    };
  }, []);

  // Save watch history to localStorage whenever it changes
  const saveToLocalStorage = useCallback((history: WatchHistoryItem[]) => {
    try {
      localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save watch history:', error);
    }
  }, []);

  // Sync progress to backend API (debounced)
  const syncProgressToBackend = useCallback(
    (contentId: string, progress: number, immediate = false) => {
      // Clear existing timeout for this content
      if (syncTimeoutRef.current[contentId]) {
        clearTimeout(syncTimeoutRef.current[contentId]);
      }

      const doSync = async () => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/streaming/${contentId}/progress`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ watchProgress: progress }),
            },
          );

          if (!response.ok) {
            console.warn(
              `Failed to sync progress for ${contentId}: ${response.status}`,
            );
          }
        } catch (error) {
          console.warn(
            `Failed to sync progress to backend for ${contentId}:`,
            error,
          );
        } finally {
          // Clean up timeout reference
          delete syncTimeoutRef.current[contentId];
        }
      };

      if (immediate) {
        // Sync immediately (e.g., on video close)
        doSync();
      } else {
        // Debounce by 5 seconds
        syncTimeoutRef.current[contentId] = setTimeout(doSync, 5000);
      }
    },
    [],
  );

  // Update progress for a content item
  const updateProgress = useCallback(
    (contentId: string, progress: number, immediate = false) => {
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

      // Sync to backend (debounced unless immediate)
      syncProgressToBackend(contentId, progress, immediate);
    },
    [saveToLocalStorage, syncProgressToBackend],
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
    isInitialized,
    updateProgress,
    getProgress,
    clearHistory,
  };
}