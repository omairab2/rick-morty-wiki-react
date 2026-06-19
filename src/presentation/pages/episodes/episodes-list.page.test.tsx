import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { NuqsTestingAdapter } from 'nuqs/adapters/testing';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { server } from '@/infrastructure/mocks/server';
import { EpisodesListPage } from '@/presentation/pages/episodes/episodes-list.page';
import { env } from '@/shared/config/env';

const EPISODE_ENDPOINT = `${env.apiBaseUrl}/episode`;
const EMPTY_LIST = { info: { count: 0, pages: 0, next: null, prev: null }, results: [] };

function renderEpisodesList(searchParams = '') {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return render(<EpisodesListPage />, {
    wrapper: ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={[`/episodes${searchParams}`]}>
        <QueryClientProvider client={queryClient}>
          <NuqsTestingAdapter searchParams={searchParams}>{children}</NuqsTestingAdapter>
        </QueryClientProvider>
      </MemoryRouter>
    ),
  });
}

describe('EpisodesListPage', () => {
  it('renders the heading and the fetched episodes', async () => {
    renderEpisodesList();

    expect(screen.getByRole('heading', { level: 1, name: 'Episodes' })).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText('Pilot')).toBeInTheDocument());
    expect(screen.getByText('Lawnmower Dog')).toBeInTheDocument();
    expect(screen.getByText('3 episodes found')).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
  });

  it('shows the empty state with the active search term', async () => {
    server.use(http.get(EPISODE_ENDPOINT, () => HttpResponse.json(EMPTY_LIST)));

    renderEpisodesList('?name=zzz');

    await waitFor(() =>
      expect(screen.getByText("No episodes found for 'zzz'")).toBeInTheDocument(),
    );
    expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument();
  });

  it('shows an error state and recovers on retry', async () => {
    const user = userEvent.setup();
    server.use(
      http.get(EPISODE_ENDPOINT, () => HttpResponse.json({ error: 'boom' }, { status: 500 })),
    );

    renderEpisodesList();

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument(),
    );
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

    server.resetHandlers();
    await user.click(screen.getByRole('button', { name: /try again/i }));

    await waitFor(() => expect(screen.getByText('Pilot')).toBeInTheDocument());
  });
});
