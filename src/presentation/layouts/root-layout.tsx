import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import { Outlet } from 'react-router';

/**
 * Root layout rendered inside the router. The nuqs adapter lives here (rather
 * than in global Providers) because it depends on the router's search params.
 */
export function RootLayout() {
  return (
    <NuqsAdapter>
      <div className="bg-background text-foreground min-h-screen">
        <Outlet />
      </div>
    </NuqsAdapter>
  );
}
