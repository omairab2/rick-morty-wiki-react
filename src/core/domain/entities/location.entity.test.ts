import { describe, expect, it } from 'vitest';

import type { Location } from '@/core/domain/entities/location.entity';

describe('Location entity', () => {
  it('models a location with domain-friendly fields', () => {
    const location: Location = {
      id: 1,
      name: 'Earth (C-137)',
      type: 'Planet',
      dimension: 'Dimension C-137',
      residentIds: [1, 2],
    };

    expect(location).toEqual({
      id: 1,
      name: 'Earth (C-137)',
      type: 'Planet',
      dimension: 'Dimension C-137',
      residentIds: [1, 2],
    });
  });
});
