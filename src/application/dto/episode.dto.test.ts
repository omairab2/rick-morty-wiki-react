import { describe, expect, it } from 'vitest';

import {
  EPISODE_REQUEST_PARAM_KEYS,
  normalizeEpisodesResponse,
  type EpisodeApiDto,
} from '@/application/dto/episode.dto';

function buildEpisode(overrides: Partial<EpisodeApiDto> = {}): EpisodeApiDto {
  return {
    id: 1,
    name: 'Pilot',
    air_date: 'December 2, 2013',
    episode: 'S01E01',
    characters: ['https://rickandmortyapi.com/api/character/1'],
    url: 'https://rickandmortyapi.com/api/episode/1',
    created: '2017-11-10T12:56:33.798Z',
    ...overrides,
  };
}

describe('EPISODE_REQUEST_PARAM_KEYS', () => {
  it('matches exactly the query params the Rick & Morty /episode endpoint accepts', () => {
    expect([...EPISODE_REQUEST_PARAM_KEYS]).toEqual(['name', 'episode', 'page']);
  });
});

describe('normalizeEpisodesResponse', () => {
  it('wraps a single episode object into an array', () => {
    const episode = buildEpisode();

    expect(normalizeEpisodesResponse(episode)).toEqual([episode]);
  });

  it('returns an array response unchanged', () => {
    const episodes = [buildEpisode({ id: 1 }), buildEpisode({ id: 2, episode: 'S01E02' })];

    expect(normalizeEpisodesResponse(episodes)).toEqual(episodes);
  });
});
