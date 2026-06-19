import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { NuqsTestingAdapter } from 'nuqs/adapters/testing';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { server } from '@/infrastructure/mocks/server';
import { LocationsListPage } from '@/presentation/pages/locations/locations-list.page';
import { env } from '@/shared/config/env';

const LOCATION_ENDPOINT = `${env.apiBaseUrl}/location`;
const EMPTY_LIST = { info: { count: 0, pages: 0, next: null, prev: null }, results: [] };

function renderLocationsList(searchParams = '') {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return render(<LocationsListPage />, {
    wrapper: ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={[`/locations${searchParams}`]}>
        <QueryClientProvider client={queryClient}>
          <NuqsTestingAdapter searchParams={searchParams}>{children}</NuqsTestingAdapter>
        </QueryClientProvider>
      </MemoryRouter>
    ),
  });
}

describe('LocationsListPage', () => {
  it('renders the heading and the fetched locations', async () => {
    renderLocationsList();

    expect(screen.getByRole('heading', { level: 1, name: 'Locations' })).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText('Earth (C-137)')).toBeInTheDocument());
    expect(screen.getByText('Abadango')).toBeInTheDocument();
    expect(screen.getByText('3 locations found')).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
  });

  it('shows the empty state with the active search term', async () => {
    server.use(http.get(LOCATION_ENDPOINT, () => HttpResponse.json(EMPTY_LIST)));

    renderLocationsList('?name=zzz');

    await waitFor(() =>
      expect(screen.getByText("No locations found for 'zzz'")).toBeInTheDocument(),
    );
    expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument();
  });

  it('shows an error state and recovers on retry', async () => {
    const user = userEvent.setup();
    server.use(
      http.get(LOCATION_ENDPOINT, () => HttpResponse.json({ error: 'boom' }, { status: 500 })),
    );

    renderLocationsList();

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument(),
    );
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

    server.resetHandlers();
    await user.click(screen.getByRole('button', { name: /try again/i }));

    await waitFor(() => expect(screen.getByText('Earth (C-137)')).toBeInTheDocument());
  });
});
