import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { NuqsTestingAdapter } from 'nuqs/adapters/testing';
import { createMemoryRouter, MemoryRouter, RouterProvider } from 'react-router';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { CharacterDetailPage } from '@/presentation/pages/character-detail/character-detail.page';
import { HomePage } from '@/presentation/pages/home/home-page';

function createClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

/**
 * Structural / semantic accessibility regression. Runs in jsdom, so it covers
 * ARIA, roles, names and landmarks — but NOT color contrast (jsdom can't render
 * colors). Contrast is asserted in the real browser by `e2e/accessibility.spec.ts`.
 */
describe('accessibility', () => {
  it('home page (characters list) has no axe violations', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <QueryClientProvider client={createClient()}>
          <NuqsTestingAdapter>
            <HomePage />
          </NuqsTestingAdapter>
        </QueryClientProvider>
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByText('Rick Sanchez')).toBeInTheDocument());

    const results = await axe(document.body);

    expect(results.violations.map((violation) => violation.id)).toEqual([]);
  });

  it('character detail page has no axe violations', async () => {
    const router = createMemoryRouter(
      [{ path: '/characters/:id', element: <CharacterDetailPage /> }],
      { initialEntries: ['/characters/1'] },
    );

    render(
      <QueryClientProvider client={createClient()}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    );

    await waitFor(() => expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument());

    const results = await axe(document.body);

    expect(results.violations.map((violation) => violation.id)).toEqual([]);
  });
});
