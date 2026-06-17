import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { NotFoundState } from '@/presentation/components/character/not-found-state';

describe('NotFoundState', () => {
  it('shows a not-found heading and a link back to the list', () => {
    render(
      <MemoryRouter>
        <NotFoundState backTo="/?name=rick" />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: /character not found/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to characters/i })).toHaveAttribute(
      'href',
      '/?name=rick',
    );
  });
});
