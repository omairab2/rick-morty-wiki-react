import { describe, expect, it } from 'vitest';

import type { EpisodeApiDto, GetEpisodesListResponseDto } from '@/application/dto/episode.dto';
import { mapEpisode, mapEpisodePage } from '@/infrastructure/mappers/episode.mapper';

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
      characterIds: [1],
    });
  });
});

describe('mapEpisodePage', () => {
  it('maps the list response to a domain EpisodePage', () => {
    const dto: GetEpisodesListResponseDto = {
      info: {
        count: 51,
        pages: 3,
        next: 'https://rickandmortyapi.com/api/episode?page=2',
        prev: null,
      },
      results: [
        {
          id: 1,
          name: 'Pilot',
          air_date: 'December 2, 2013',
          episode: 'S01E01',
          characters: ['https://rickandmortyapi.com/api/character/1'],
          url: 'https://rickandmortyapi.com/api/episode/1',
          created: '2017-11-10T12:56:33.798Z',
        },
      ],
    };

    expect(mapEpisodePage({ dto, requestedPage: 1 })).toMatchObject({
      page: 1,
      totalPages: 3,
      totalCount: 51,
      hasNextPage: true,
      hasPreviousPage: false,
    });
  });
});
