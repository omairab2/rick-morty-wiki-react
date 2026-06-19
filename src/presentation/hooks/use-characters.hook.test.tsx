import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

import { characterNotFoundHandler } from '@/infrastructure/mocks/handlers';
import { server } from '@/infrastructure/mocks/server';
import { useCharacters } from '@/presentation/hooks/use-characters.hook';
import { env } from '@/shared/config/env';

const CHARACTER_ENDPOINT = `${env.apiBaseUrl}/character`;

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

  it('resolves to an empty page when the API responds with 404 (no results)', async () => {
    server.use(characterNotFoundHandler);

    const { result } = renderHook(() => useCharacters({ page: 1, filters: {} }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.characters).toHaveLength(0);
    expect(result.current.data?.totalCount).toBe(0);
  });

  it('surfaces an error when the request genuinely fails', async () => {
    server.use(
      http.get(CHARACTER_ENDPOINT, () => HttpResponse.json({ error: 'boom' }, { status: 500 })),
    );

    const { result } = renderHook(() => useCharacters({ page: 1, filters: {} }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
