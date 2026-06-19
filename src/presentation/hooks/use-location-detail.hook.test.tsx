import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

import { useLocationDetail } from '@/presentation/hooks/use-location-detail.hook';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useLocationDetail', () => {
  it('returns the location and its residents on success', async () => {
    const { result } = renderHook(() => useLocationDetail({ id: 1 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.location.type).toBe('Planet');
    expect(result.current.data?.residents).toHaveLength(2);
  });
});
