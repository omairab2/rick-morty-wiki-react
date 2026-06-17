import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CharacterCardSkeleton } from '@/presentation/components/character/character-card-skeleton';

describe('CharacterCardSkeleton', () => {
  it('renders placeholders and is hidden from assistive technology', () => {
    const { container } = render(<CharacterCardSkeleton />);

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);
  });
});
