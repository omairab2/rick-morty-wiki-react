import { Suspense, useEffect, useRef } from 'react';

import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import { NavLink, Outlet, useLocation } from 'react-router';

import { AppPath } from '@/presentation/routes/paths';
import { cn } from '@/shared/lib/utils';

const MAIN_CONTENT_ID = 'main-content';

const NAV_LINKS = [
  { to: AppPath.Home, label: 'Characters', end: true },
  { to: AppPath.Episodes, label: 'Episodes', end: false },
  { to: AppPath.Locations, label: 'Locations', end: false },
];

/**
 * Root layout rendered inside the router. The nuqs adapter lives here (rather
 * than in global Providers) because it depends on the router's search params.
 * The Suspense boundary covers the lazily-loaded route pages.
 *
 * Accessibility:
 * - A skip link (first focusable element) lets keyboard users jump past the nav
 *   straight to the content region (`#main-content`).
 * - On route change, focus moves to that region so keyboard and screen-reader
 *   users land on the new page's content instead of staying on the clicked link.
 */
export function RootLayout() {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    mainRef.current?.focus();
  }, [pathname]);

  return (
    <NuqsAdapter>
      <div className="bg-background text-foreground min-h-screen">
        <a
          href={`#${MAIN_CONTENT_ID}`}
          className="bg-background text-foreground focus-visible:ring-ring sr-only z-50 rounded-md px-4 py-2 text-sm font-medium shadow focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:ring-2 focus-visible:outline-none"
        >
          Skip to main content
        </a>

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

        <div id={MAIN_CONTENT_ID} ref={mainRef} tabIndex={-1} className="outline-none">
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
      </div>
    </NuqsAdapter>
  );
}
