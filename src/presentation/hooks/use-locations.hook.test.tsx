import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

import { server } from '@/infrastructure/mocks/server';
import { useLocations } from '@/presentation/hooks/use-locations.hook';
import { env } from '@/shared/config/env';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useLocations', () => {
  it('returns the fetched location page on success', async () => {
    const { result } = renderHook(() => useLocations({ page: 1, filters: {} }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.locations).toHaveLength(3);
    expect(result.current.data?.page).toBe(1);
  });

  it('surfaces an error when the API fails', async () => {
    server.use(
      http.get(`${env.apiBaseUrl}/location`, () =>
        HttpResponse.json({ error: 'boom' }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useLocations({ page: 1, filters: {} }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
