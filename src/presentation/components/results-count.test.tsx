import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ResultsCount } from '@/presentation/components/results-count';

describe('ResultsCount', () => {
  it('shows the plural label for several results', () => {
    render(<ResultsCount count={826} singular="character" plural="characters" />);

    expect(screen.getByText('826 characters found')).toBeInTheDocument();
  });

  it('shows the singular label for exactly one result', () => {
    render(<ResultsCount count={1} singular="character" plural="characters" />);

    expect(screen.getByText('1 character found')).toBeInTheDocument();
  });

  it('shows the empty label when there are no results', () => {
    render(<ResultsCount count={0} singular="character" plural="characters" />);

    expect(screen.getByText('No characters found')).toBeInTheDocument();
  });
});
