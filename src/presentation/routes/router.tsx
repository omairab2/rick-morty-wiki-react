import { createBrowserRouter, RouterProvider } from 'react-router';

import { RootLayout } from '@/presentation/layouts/root-layout';
import { HomePage } from '@/presentation/pages/home/home-page';
import { NotFoundPage } from '@/presentation/pages/not-found/not-found-page';
import { AppPath } from '@/presentation/routes/paths';

const CATCH_ALL_PATH = '*';

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
