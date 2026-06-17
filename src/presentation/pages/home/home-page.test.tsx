import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { NuqsTestingAdapter } from 'nuqs/adapters/testing';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { characterNotFoundHandler, characterSuccessHandler } from '@/infrastructure/mocks/handlers';
import { server } from '@/infrastructure/mocks/server';
import { HomePage } from '@/presentation/pages/home/home-page';
import { env } from '@/shared/config/env';

const CHARACTER_ENDPOINT = `${env.apiBaseUrl}/character`;
const EMPTY_RESPONSE = { info: { count: 0, pages: 0, next: null, prev: null }, results: [] };

function renderHomePage(searchParams = '') {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return render(<HomePage />, {
    wrapper: ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={[`/${searchParams}`]}>
        <QueryClientProvider client={queryClient}>
          <NuqsTestingAdapter searchParams={searchParams}>{children}</NuqsTestingAdapter>
        </QueryClientProvider>
      </MemoryRouter>
    ),
  });
}

describe('HomePage', () => {
  it('renders the project heading and the fetched characters', async () => {
    renderHomePage();

    expect(
      screen.getByRole('heading', { level: 1, name: /rick & morty wiki/i }),
    ).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText('Rick Sanchez')).toBeInTheDocument());
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
  });

  it('shows the empty state with the active search term', async () => {
    server.use(http.get(CHARACTER_ENDPOINT, () => HttpResponse.json(EMPTY_RESPONSE)));

    renderHomePage('?name=bethb');

    await waitFor(() =>
      expect(screen.getByText("No characters found for 'bethb'")).toBeInTheDocument(),
    );
    expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument();
  });

  it('shows an error state and retries with refetch on success', async () => {
    const user = userEvent.setup();
    server.use(characterNotFoundHandler);

    renderHomePage();

    await waitFor(() => expect(screen.getByText(/something went wrong/i)).toBeInTheDocument());

    server.use(characterSuccessHandler);
    await user.click(screen.getByRole('button', { name: /try again/i }));

    await waitFor(() => expect(screen.getByText('Rick Sanchez')).toBeInTheDocument());
  });
});
