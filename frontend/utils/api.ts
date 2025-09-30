import { StreamingContent } from '@/types/content';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchStreamingContent(): Promise<StreamingContent[]> {
  const response = await fetch(`${API_BASE_URL}/api/streaming`, {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });

  if (!response.ok) {
    throw new Error('Failed to fetch streaming content');
  }

  return response.json();
}

export async function fetchStreamingContentById(
  id: string,
): Promise<StreamingContent> {
  const response = await fetch(`${API_BASE_URL}/api/streaming/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch streaming content');
  }

  return response.json();
}