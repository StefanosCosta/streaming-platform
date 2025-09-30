'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header/Header';
import LoadingSkeleton from '@/components/LoadingSkeleton/LoadingSkeleton';
import ContentGrid from '@/components/ContentGrid/ContentGrid';
import ContentModal from '@/components/ContentModal/ContentModal';
import WatchHistory from '@/components/WatchHistory/WatchHistory';
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer';
import { StreamingContent } from '@/types/content';
import { fetchStreamingContent } from '@/utils/api';
import { useWatchHistory } from '@/hooks/useWatchHistory';

export default function Home() {
  const [content, setContent] = useState<StreamingContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] =
    useState<StreamingContent | null>(null);
  const [playingContent, setPlayingContent] =
    useState<StreamingContent | null>(null);

  const { watchHistory, updateProgress, getProgress } = useWatchHistory();

  // Load content on mount
  useEffect(() => {
    async function loadContent() {
      try {
        setLoading(true);
        const data = await fetchStreamingContent();
        setContent(data);
      } catch (err) {
        setError('Failed to load content. Please try again later.');
        console.error('Error loading content:', err);
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, []);

  // Create a map of content ID to watch progress
  const watchProgressMap = useMemo(() => {
    const map = new Map<string, number>();
    watchHistory.forEach((item) => {
      map.set(item.contentId, item.progress);
    });
    return map;
  }, [watchHistory]);

  // Group content by genre
  const contentByGenre = useMemo(() => {
    const genres = new Map<string, StreamingContent[]>();

    content.forEach((item) => {
      if (!genres.has(item.genre)) {
        genres.set(item.genre, []);
      }
      genres.get(item.genre)?.push(item);
    });

    return genres;
  }, [content]);

  const handleContentClick = (content: StreamingContent) => {
    setSelectedContent(content);
  };

  const handleModalClose = () => {
    setSelectedContent(null);
  };

  const handlePlay = (content: StreamingContent) => {
    setPlayingContent(content);
    setSelectedContent(null);
  };

  const handleVideoClose = () => {
    setPlayingContent(null);
  };

  const handleVideoProgress = (contentId: string, progress: number) => {
    updateProgress(contentId, progress);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Header />
        <div className="text-center space-y-4 pt-20">
          <svg
            className="w-16 h-16 text-gray-600 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-semibold text-white">{error}</h2>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        {content.length > 0 && (
          <div
            className="relative h-[70vh] bg-cover bg-center"
            style={{
              backgroundImage: `url(${content[0].thumbnailUrl})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 md:p-12 space-y-4 max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                {content[0].title}
              </h1>
              <p className="text-lg text-gray-200 line-clamp-3">
                {content[0].description}
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => handlePlay(content[0])}
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
                  onClick={() => handleContentClick(content[0])}
                  className="flex items-center space-x-2 bg-gray-600 bg-opacity-70 hover:bg-opacity-90 transition-all px-8 py-3 rounded font-semibold text-white"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>More Info</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Continue Watching */}
        <div id="history" className="pt-8">
          <WatchHistory
            content={content}
            watchHistory={watchHistory}
            onContentClick={handleContentClick}
          />
        </div>

        {/* Trending Now */}
        <div id="trending" className="py-8 space-y-8">
          <ContentGrid
            title="Trending Now"
            content={content.slice(0, 10)}
            watchProgress={watchProgressMap}
            onContentClick={handleContentClick}
          />

          {/* Content by Genre */}
          {Array.from(contentByGenre.entries()).map(([genre, items]) => (
            <ContentGrid
              key={genre}
              title={genre}
              content={items}
              watchProgress={watchProgressMap}
              onContentClick={handleContentClick}
            />
          ))}
        </div>
      </main>

      {/* Content Modal */}
      <ContentModal
        content={selectedContent}
        onClose={handleModalClose}
        onPlay={handlePlay}
      />

      {/* Video Player */}
      {playingContent && (
        <VideoPlayer
          content={playingContent}
          initialProgress={getProgress(playingContent.id)}
          onClose={handleVideoClose}
          onProgress={handleVideoProgress}
        />
      )}
    </div>
  );
}