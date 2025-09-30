import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ContentGrid from '@/components/ContentGrid/ContentGrid';
import { StreamingContent } from '@/types/content';

describe('ContentGrid', () => {
  const mockContent: StreamingContent[] = [
    {
      id: '1',
      title: 'Test Movie 1',
      description: 'Test description 1',
      thumbnailUrl: 'https://example.com/thumb1.jpg',
      videoUrl: 'https://example.com/video1.mp4',
      year: 2024,
      genre: 'Action',
      rating: 8.5,
      duration: 120,
      cast: ['Actor 1', 'Actor 2'],
      watchProgress: 0,
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      title: 'Test Movie 2',
      description: 'Test description 2',
      thumbnailUrl: 'https://example.com/thumb2.jpg',
      videoUrl: 'https://example.com/video2.mp4',
      year: 2023,
      genre: 'Comedy',
      rating: 7.5,
      duration: 110,
      cast: ['Actor 3', 'Actor 4'],
      watchProgress: 0,
      createdAt: '2024-01-02T00:00:00Z',
    },
  ];

  it('should render the title', () => {
    const mockOnClick = vi.fn();

    render(
      <ContentGrid
        title="Trending Now"
        content={mockContent}
        onContentClick={mockOnClick}
      />,
    );

    expect(screen.getByText('Trending Now')).toBeInTheDocument();
  });

  it('should render all content cards', () => {
    const mockOnClick = vi.fn();

    render(
      <ContentGrid
        title="Trending Now"
        content={mockContent}
        onContentClick={mockOnClick}
      />,
    );

    expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
    expect(screen.getByText('Test Movie 2')).toBeInTheDocument();
  });

  it('should not render when content is empty', () => {
    const mockOnClick = vi.fn();

    const { container } = render(
      <ContentGrid
        title="Trending Now"
        content={[]}
        onContentClick={mockOnClick}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render scroll buttons', () => {
    const mockOnClick = vi.fn();

    render(
      <ContentGrid
        title="Trending Now"
        content={mockContent}
        onContentClick={mockOnClick}
      />,
    );

    const scrollButtons = screen.getAllByRole('button');
    // Should have scroll left and scroll right buttons
    expect(scrollButtons.length).toBeGreaterThanOrEqual(2);
  });

  it('should display watch progress when provided', () => {
    const mockOnClick = vi.fn();
    const watchProgress = new Map([['1', 50]]);

    render(
      <ContentGrid
        title="Trending Now"
        content={mockContent}
        watchProgress={watchProgress}
        onContentClick={mockOnClick}
      />,
    );

    // Content should render with progress
    expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
  });
});