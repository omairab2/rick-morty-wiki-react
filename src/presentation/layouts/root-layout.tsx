import { Suspense } from 'react';

import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import { NavLink, Outlet } from 'react-router';

import { AppPath } from '@/presentation/routes/paths';
import { cn } from '@/shared/lib/utils';

const NAV_LINKS = [
  { to: AppPath.Home, label: 'Characters', end: true },
  { to: AppPath.Episodes, label: 'Episodes', end: false },
];

/**
 * Root layout rendered inside the router. The nuqs adapter lives here (rather
 * than in global Providers) because it depends on the router's search params.
 * The Suspense boundary covers the lazily-loaded route pages.
 */
export function RootLayout() {
  return (
    <NuqsAdapter>
      <div className="bg-background text-foreground min-h-screen">
        <header className="border-b">
          <nav
            className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-4 text-sm"
            aria-label="Main"
          >
            <span className="font-bold tracking-tight">Rick &amp; Morty Wiki</span>
            <div className="flex items-center gap-4">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    cn(
                      'hover:text-foreground transition-colors',
                      isActive ? 'text-foreground font-medium' : 'text-muted-foreground',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </nav>
        </header>

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
