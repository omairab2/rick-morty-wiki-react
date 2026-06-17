import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { HomePage } from '@/presentation/pages/home/home-page';

describe('HomePage', () => {
  it('renders the wiki heading', () => {
    render(<HomePage />);

    expect(screen.getByRole('heading', { name: /rick & morty wiki/i })).toBeInTheDocument();
  });
});
