import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LocationDetailSkeleton } from '@/presentation/components/location/location-detail-skeleton';

describe('LocationDetailSkeleton', () => {
  it('renders a loading status with placeholders', () => {
    const { container } = render(<LocationDetailSkeleton />);

    expect(screen.getByRole('status', { name: /loading location/i })).toBeInTheDocument();
    expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);
  });
});
