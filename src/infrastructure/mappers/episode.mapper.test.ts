import { describe, expect, it } from 'vitest';

import type { EpisodeApiDto } from '@/application/dto/episode.dto';
import { mapEpisode } from '@/infrastructure/mappers/episode.mapper';

describe('mapEpisode', () => {
  it('maps an API episode DTO to the domain entity', () => {
    const dto: EpisodeApiDto = {
      id: 1,
      name: 'Pilot',
      air_date: 'December 2, 2013',
      episode: 'S01E01',
      characters: ['https://rickandmortyapi.com/api/character/1'],
      url: 'https://rickandmortyapi.com/api/episode/1',
      created: '2017-11-10T12:56:33.798Z',
    };

    expect(mapEpisode(dto)).toEqual({
      id: 1,
      name: 'Pilot',
      code: 'S01E01',
      airDate: 'December 2, 2013',
    });
  });
});
