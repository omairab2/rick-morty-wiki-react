import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';

import { server } from '@/infrastructure/mocks/server';
import { LocationDetailPage } from '@/presentation/pages/location-detail/location-detail.page';
import { env } from '@/shared/config/env';

function renderDetail(initialEntry: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const router = createMemoryRouter([{ path: '/locations/:id', element: <LocationDetailPage /> }], {
    initialEntries: [initialEntry],
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

describe('LocationDetailPage', () => {
  it('shows a loading skeleton and then the location with its residents', async () => {
    renderDetail('/locations/1');

    expect(screen.getByRole('status', { name: /loading location/i })).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 1, name: 'Location 1' })).toBeInTheDocument(),
    );
    expect(screen.getByRole('heading', { level: 2, name: /residents \(2\)/i })).toBeInTheDocument();
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
  });

  it('renders the not-found state for a 404', async () => {
    renderDetail('/locations/9999');

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /location not found/i })).toBeInTheDocument(),
    );
  });

  it('renders the generic error state and recovers on retry', async () => {
    const user = userEvent.setup();
    server.use(
      http.get(`${env.apiBaseUrl}/location/:ids`, () =>
        HttpResponse.json({ error: 'boom' }, { status: 500 }),
      ),
    );

    renderDetail('/locations/1');

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument(),
    );
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

    server.resetHandlers();
    await user.click(screen.getByRole('button', { name: /try again/i }));

    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 1, name: 'Location 1' })).toBeInTheDocument(),
    );
  });
});
