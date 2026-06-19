import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

import { useEpisodeDetail } from '@/presentation/hooks/use-episode-detail.hook';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useEpisodeDetail', () => {
  it('returns the episode and its characters on success', async () => {
    const { result } = renderHook(() => useEpisodeDetail({ id: 1 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.episode.code).toBe('S01E01');
    expect(result.current.data?.characters).toHaveLength(2);
  });
});
