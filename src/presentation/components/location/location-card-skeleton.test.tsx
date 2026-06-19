import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LocationCardSkeleton } from '@/presentation/components/location/location-card-skeleton';

describe('LocationCardSkeleton', () => {
  it('renders a hidden placeholder', () => {
    const { container } = render(<LocationCardSkeleton />);

    expect(container.querySelector('[data-slot="skeleton"]')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });
});
