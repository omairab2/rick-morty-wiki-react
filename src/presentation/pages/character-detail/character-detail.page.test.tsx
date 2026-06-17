import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';

import { server } from '@/infrastructure/mocks/server';
import { CharacterDetailPage } from '@/presentation/pages/character-detail/character-detail.page';
import { env } from '@/shared/config/env';

function renderDetail(initialEntry: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const router = createMemoryRouter(
    [{ path: '/characters/:id', element: <CharacterDetailPage /> }],
    { initialEntries: [initialEntry] },
  );

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

describe('CharacterDetailPage', () => {
  it('shows a loading skeleton and then the character with its episodes', async () => {
    renderDetail('/characters/1');

    expect(screen.getByRole('status', { name: /loading character/i })).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 1, name: 'Rick Sanchez' })).toBeInTheDocument(),
    );
    expect(screen.getByRole('heading', { level: 2, name: /episodes \(2\)/i })).toBeInTheDocument();
  });

  it('renders the not-found state for a 404', async () => {
    renderDetail('/characters/9999');

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /character not found/i })).toBeInTheDocument(),
    );
  });

  it('renders the generic error state and recovers on retry', async () => {
    const user = userEvent.setup();
    server.use(
      http.get(`${env.apiBaseUrl}/character/:id`, () =>
        HttpResponse.json({ error: 'boom' }, { status: 500 }),
      ),
    );

    renderDetail('/characters/1');

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument(),
    );
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

    // Restore the default (successful) handlers, then retry.
    server.resetHandlers();
    await user.click(screen.getByRole('button', { name: /try again/i }));

    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 1, name: 'Rick Sanchez' })).toBeInTheDocument(),
    );
  });
});
