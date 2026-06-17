import { Suspense } from 'react';

import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import { Outlet } from 'react-router';

/**
 * Root layout rendered inside the router. The nuqs adapter lives here (rather
 * than in global Providers) because it depends on the router's search params.
 * The Suspense boundary covers the lazily-loaded route pages.
 */
export function RootLayout() {
  return (
    <NuqsAdapter>
      <div className="bg-background text-foreground min-h-screen">
        <Suspense
          fallback={
            <div
              className="text-muted-foreground px-6 py-10"
              role="status"
              aria-label="Loading page"
            >
              Loading…
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </div>
    </NuqsAdapter>
  );
}
