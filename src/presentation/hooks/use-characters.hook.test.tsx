import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

import { characterNotFoundHandler } from '@/infrastructure/mocks/handlers';
import { server } from '@/infrastructure/mocks/server';
import { useCharacters } from '@/presentation/hooks/use-characters.hook';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useCharacters', () => {
  it('returns the fetched character page on success', async () => {
    const { result } = renderHook(() => useCharacters({ page: 1, filters: {} }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.characters).toHaveLength(2);
    expect(result.current.data?.page).toBe(1);
  });

  it('surfaces an error when the API responds with 404', async () => {
    server.use(characterNotFoundHandler);

    const { result } = renderHook(() => useCharacters({ page: 1, filters: {} }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
