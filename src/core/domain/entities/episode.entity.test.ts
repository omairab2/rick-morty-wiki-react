import { describe, expect, it } from 'vitest';

import type { Episode } from '@/core/domain/entities/episode.entity';

describe('Episode entity', () => {
  it('models an episode with domain-friendly fields', () => {
    const episode: Episode = {
      id: 1,
      name: 'Pilot',
      code: 'S01E01',
      airDate: 'December 2, 2013',
    };

    expect(episode).toEqual({
      id: 1,
      name: 'Pilot',
      code: 'S01E01',
      airDate: 'December 2, 2013',
    });
  });
});
