import { describe, expect, it } from 'vitest';

import type { CharacterRepository } from '@/core/domain/repositories/character.repository';

describe('CharacterRepository (port contract)', () => {
  it('can be implemented and resolves a character page', async () => {
    const repository: CharacterRepository = {
      getCharacters: ({ page }) =>
        Promise.resolve({
          characters: [],
          page,
          totalPages: 0,
          totalCount: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        }),
    };

    const result = await repository.getCharacters({ page: 1, filters: {} });

    expect(result).toMatchObject({ page: 1, characters: [] });
  });
});
