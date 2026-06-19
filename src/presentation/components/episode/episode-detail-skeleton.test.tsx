import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { EpisodeDetailSkeleton } from '@/presentation/components/episode/episode-detail-skeleton';

describe('EpisodeDetailSkeleton', () => {
  it('renders a loading status with placeholders', () => {
    const { container } = render(<EpisodeDetailSkeleton />);

    expect(screen.getByRole('status', { name: /loading episode/i })).toBeInTheDocument();
    expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);
  });
});
