import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ContentModal from '@/components/ContentModal/ContentModal';
import { StreamingContent } from '@/types/content';

describe('ContentModal', () => {
  const mockContent: StreamingContent = {
    id: '1',
    title: 'Test Movie',
    description: 'Test description for the movie',
    thumbnailUrl: 'https://example.com/thumb.jpg',
    videoUrl: 'https://example.com/video.mp4',
    year: 2024,
    genre: 'Action',
    rating: 8.5,
    duration: 120,
    cast: ['Actor 1', 'Actor 2', 'Actor 3'],
    watchProgress: 0,
    createdAt: '2024-01-01T00:00:00Z',
  };

  const mockOnClose = vi.fn();
  const mockOnPlay = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up body overflow style
    document.body.style.overflow = 'unset';
  });

  it('should not render when content is null', () => {
    const { container } = render(
      <ContentModal content={null} onClose={mockOnClose} onPlay={mockOnPlay} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render modal with content details', () => {
    render(
      <ContentModal
        content={mockContent}
        onClose={mockOnClose}
        onPlay={mockOnPlay}
      />,
    );

    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(
      screen.getByText('Test description for the movie'),
    ).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('8.5/10')).toBeInTheDocument();
    expect(screen.getByText('120 min')).toBeInTheDocument();
    expect(screen.getByText('Actor 1, Actor 2, Actor 3')).toBeInTheDocument();
  });

  it('should have proper ARIA attributes', () => {
    render(
      <ContentModal
        content={mockContent}
        onClose={mockOnClose}
        onPlay={mockOnPlay}
      />,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
  });

  it('should call onClose when close button is clicked', () => {
    render(
      <ContentModal
        content={mockContent}
        onClose={mockOnClose}
        onPlay={mockOnPlay}
      />,
    );

    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onPlay when play button is clicked', () => {
    render(
      <ContentModal
        content={mockContent}
        onClose={mockOnClose}
        onPlay={mockOnPlay}
      />,
    );

    const playButton = screen.getByRole('button', { name: /play/i });
    fireEvent.click(playButton);

    expect(mockOnPlay).toHaveBeenCalledTimes(1);
    expect(mockOnPlay).toHaveBeenCalledWith(mockContent);
  });

  it('should call onClose when backdrop is clicked', () => {
    render(
      <ContentModal
        content={mockContent}
        onClose={mockOnClose}
        onPlay={mockOnPlay}
      />,
    );

    const backdrop = screen.getByRole('dialog');
    fireEvent.click(backdrop);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onClose when modal content is clicked', () => {
    render(
      <ContentModal
        content={mockContent}
        onClose={mockOnClose}
        onPlay={mockOnPlay}
      />,
    );

    const title = screen.getByText('Test Movie');
    fireEvent.click(title);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should close modal on Escape key press', () => {
    render(
      <ContentModal
        content={mockContent}
        onClose={mockOnClose}
        onPlay={mockOnPlay}
      />,
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should lock body scroll when modal is open', () => {
    render(
      <ContentModal
        content={mockContent}
        onClose={mockOnClose}
        onPlay={mockOnPlay}
      />,
    );

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should display rating percentage correctly', () => {
    render(
      <ContentModal
        content={mockContent}
        onClose={mockOnClose}
        onPlay={mockOnPlay}
      />,
    );

    // 8.5 rating should display as 85% Match
    expect(screen.getByText('85% Match')).toBeInTheDocument();
  });

  it('should render thumbnail image with correct src', () => {
    render(
      <ContentModal
        content={mockContent}
        onClose={mockOnClose}
        onPlay={mockOnPlay}
      />,
    );

    const image = screen.getByAltText('Test Movie');
    expect(image).toHaveAttribute('src', 'https://example.com/thumb.jpg');
  });

  it('should work without onPlay callback', () => {
    render(<ContentModal content={mockContent} onClose={mockOnClose} />);

    const playButton = screen.getByRole('button', { name: /play/i });
    fireEvent.click(playButton);

    // Should not throw error
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
