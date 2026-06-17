import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CharacterDetailSkeleton } from '@/presentation/components/character/character-detail-skeleton';

describe('CharacterDetailSkeleton', () => {
  it('renders a loading status with placeholders', () => {
    const { container } = render(<CharacterDetailSkeleton />);

    expect(screen.getByRole('status', { name: /loading character/i })).toBeInTheDocument();
    expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);
  });
});
