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
const CharacterDetailPage = lazy(() =>
  import('@/presentation/pages/character-detail/character-detail.page').then((module) => ({
    default: module.CharacterDetailPage,
  })),
);
const EpisodesListPage = lazy(() =>
  import('@/presentation/pages/episodes/episodes-list.page').then((module) => ({
    default: module.EpisodesListPage,
  })),
);
const EpisodeDetailPage = lazy(() =>
  import('@/presentation/pages/episode-detail/episode-detail.page').then((module) => ({
    default: module.EpisodeDetailPage,
  })),
);

const CHARACTER_DETAIL_ROUTE = 'characters/:id';
const EPISODES_ROUTE = 'episodes';
const EPISODE_DETAIL_ROUTE = 'episodes/:id';

const router = createBrowserRouter([
  {
    path: AppPath.Home,
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: CHARACTER_DETAIL_ROUTE, element: <CharacterDetailPage /> },
      { path: EPISODES_ROUTE, element: <EpisodesListPage /> },
      { path: EPISODE_DETAIL_ROUTE, element: <EpisodeDetailPage /> },
      { path: CATCH_ALL_PATH, element: <NotFoundPage /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
