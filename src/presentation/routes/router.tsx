import { lazy } from 'react';

import { createBrowserRouter, RouterProvider } from 'react-router';

import { RootLayout } from '@/presentation/layouts/root-layout';
import { AppPath } from '@/presentation/routes/paths';

const CATCH_ALL_PATH = '*';

// Route-level code splitting: each page is bundled into its own lazy chunk so
// it is only downloaded when that route is visited.
const HomePage = lazy(() =>
  import('@/presentation/pages/home/home-page').then((module) => ({ default: module.HomePage })),
);
const NotFoundPage = lazy(() =>
  import('@/presentation/pages/not-found/not-found-page').then((module) => ({
    default: module.NotFoundPage,
  })),
);

const router = createBrowserRouter([
  {
    path: AppPath.Home,
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: CATCH_ALL_PATH, element: <NotFoundPage /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
