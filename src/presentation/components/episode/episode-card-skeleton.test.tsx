import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { EpisodeCardSkeleton } from '@/presentation/components/episode/episode-card-skeleton';

describe('EpisodeCardSkeleton', () => {
  it('renders a hidden placeholder', () => {
    const { container } = render(<EpisodeCardSkeleton />);

    expect(container.querySelector('[data-slot="skeleton"]')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });
});
