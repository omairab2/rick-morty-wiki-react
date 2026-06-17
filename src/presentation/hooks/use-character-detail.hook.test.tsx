import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

import { useCharacterDetail } from '@/presentation/hooks/use-character-detail.hook';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useCharacterDetail', () => {
  it('returns the character and its episodes on success', async () => {
    const { result } = renderHook(() => useCharacterDetail({ id: 1 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.character.name).toBe('Rick Sanchez');
    expect(result.current.data?.episodes).toHaveLength(2);
  });
});
