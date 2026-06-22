import type { ReactNode } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { queryClient } from '@/infrastructure/query/query-client';
import { ThemeProvider } from '@/presentation/theme/theme-provider';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Global, router-agnostic providers. Router-scoped providers (e.g. the nuqs
 * adapter, which needs the router context) live in the root layout instead.
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
