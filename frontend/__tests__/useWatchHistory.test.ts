import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useWatchHistory } from '@/hooks/useWatchHistory';

describe('useWatchHistory', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with empty watch history', () => {
    const { result } = renderHook(() => useWatchHistory());

    expect(result.current.watchHistory).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('should update progress for a new content item', () => {
    const { result } = renderHook(() => useWatchHistory());

    act(() => {
      result.current.updateProgress('content-1', 50);
    });

    expect(result.current.watchHistory).toHaveLength(1);
    expect(result.current.watchHistory[0].contentId).toBe('content-1');
    expect(result.current.watchHistory[0].progress).toBe(50);
  });

  it('should update progress for an existing content item', () => {
    const { result } = renderHook(() => useWatchHistory());

    act(() => {
      result.current.updateProgress('content-1', 30);
    });

    act(() => {
      result.current.updateProgress('content-1', 60);
    });

    expect(result.current.watchHistory).toHaveLength(1);
    expect(result.current.watchHistory[0].progress).toBe(60);
  });

  it('should get progress for a content item', () => {
    const { result } = renderHook(() => useWatchHistory());

    act(() => {
      result.current.updateProgress('content-1', 75);
    });

    const progress = result.current.getProgress('content-1');
    expect(progress).toBe(75);
  });

  it('should return 0 for non-existent content', () => {
    const { result } = renderHook(() => useWatchHistory());

    const progress = result.current.getProgress('non-existent');
    expect(progress).toBe(0);
  });

  it('should persist to localStorage', () => {
    const { result } = renderHook(() => useWatchHistory());

    act(() => {
      result.current.updateProgress('content-1', 50);
    });

    const stored = localStorage.getItem('zenithflix_watch_history');
    expect(stored).toBeTruthy();

    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].contentId).toBe('content-1');
    expect(parsed[0].progress).toBe(50);
  });

  it('should load from localStorage on mount', () => {
    const mockData = [
      {
        contentId: 'content-1',
        progress: 50,
        lastWatched: new Date().toISOString(),
      },
    ];

    localStorage.setItem('zenithflix_watch_history', JSON.stringify(mockData));

    const { result } = renderHook(() => useWatchHistory());

    // Wait for the effect to run
    expect(result.current.watchHistory).toHaveLength(1);
    expect(result.current.watchHistory[0].contentId).toBe('content-1');
    expect(result.current.watchHistory[0].progress).toBe(50);
  });

  it('should clear all history', () => {
    const { result } = renderHook(() => useWatchHistory());

    act(() => {
      result.current.updateProgress('content-1', 50);
      result.current.updateProgress('content-2', 75);
    });

    expect(result.current.watchHistory).toHaveLength(2);

    act(() => {
      result.current.clearHistory();
    });

    expect(result.current.watchHistory).toHaveLength(0);
    expect(localStorage.getItem('zenithflix_watch_history')).toBeNull();
  });

  it('should handle multiple content items', () => {
    const { result } = renderHook(() => useWatchHistory());

    act(() => {
      result.current.updateProgress('content-1', 30);
      result.current.updateProgress('content-2', 60);
      result.current.updateProgress('content-3', 90);
    });

    expect(result.current.watchHistory).toHaveLength(3);
    expect(result.current.getProgress('content-1')).toBe(30);
    expect(result.current.getProgress('content-2')).toBe(60);
    expect(result.current.getProgress('content-3')).toBe(90);
  });
});