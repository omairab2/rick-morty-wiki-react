import { describe, expect, it } from 'vitest';

import type { CharacterApiDto, GetCharactersResponseDto } from '@/application/dto/character.dto';
import type {
  EpisodeApiDto,
  GetEpisodesListResponseDto,
  GetEpisodesResponseDto,
} from '@/application/dto/episode.dto';
import type {
  GetLocationsByIdsResponseDto,
  GetLocationsListResponseDto,
  LocationApiDto,
} from '@/application/dto/location.dto';
import { characterListResponse, characterNotFoundHandler } from '@/infrastructure/mocks/handlers';
import { server } from '@/infrastructure/mocks/server';
import { env } from '@/shared/config/env';

const CHARACTER_ENDPOINT = `${env.apiBaseUrl}/character`;
const EPISODE_ENDPOINT = `${env.apiBaseUrl}/episode`;
const LOCATION_ENDPOINT = `${env.apiBaseUrl}/location`;

describe('character MSW handlers', () => {
  it('serves a successful list with at least two characters by default', async () => {
    const response = await fetch(CHARACTER_ENDPOINT);
    expect(response.ok).toBe(true);

    const body = (await response.json()) as GetCharactersResponseDto;
    expect(body.results.length).toBeGreaterThanOrEqual(2);
    expect(body.results).toHaveLength(characterListResponse.results.length);
  });

  it('serves a 404 when the not-found handler is active', async () => {
    server.use(characterNotFoundHandler);

    const response = await fetch(CHARACTER_ENDPOINT);

    expect(response.status).toBe(404);
  });

  it('serves a single character by id', async () => {
    const response = await fetch(`${CHARACTER_ENDPOINT}/1`);
    expect(response.ok).toBe(true);

    const body = (await response.json()) as CharacterApiDto;
    expect(body.id).toBe(1);
    expect(body.name).toBe('Rick Sanchez');
  });

  it('serves a 404 for the reserved missing id', async () => {
    const response = await fetch(`${CHARACTER_ENDPOINT}/9999`);

    expect(response.status).toBe(404);
  });
});

describe('episode MSW handlers', () => {
  it('returns a single object when one id is requested', async () => {
    const response = await fetch(`${EPISODE_ENDPOINT}/1`);

    const body = (await response.json()) as GetEpisodesResponseDto;
    expect(Array.isArray(body)).toBe(false);
    expect((body as EpisodeApiDto).id).toBe(1);
  });

  it('returns an array when several ids are requested', async () => {
    const response = await fetch(`${EPISODE_ENDPOINT}/1,2,3`);

    const body = (await response.json()) as GetEpisodesResponseDto;
    expect(Array.isArray(body)).toBe(true);
    expect(body as EpisodeApiDto[]).toHaveLength(3);
  });

  it('filters the episode list by season code', async () => {
    const response = await fetch(`${EPISODE_ENDPOINT}?episode=S02`);

    const body = (await response.json()) as GetEpisodesListResponseDto;
    expect(body.results.length).toBeGreaterThan(0);
    expect(body.results.every((episode) => episode.episode.startsWith('S02'))).toBe(true);
  });

  it('returns an empty episode list when nothing matches the name', async () => {
    const response = await fetch(`${EPISODE_ENDPOINT}?name=Nonexistent`);

    const body = (await response.json()) as GetEpisodesListResponseDto;
    expect(body.results).toHaveLength(0);
  });
});

describe('location MSW handlers', () => {
  it('returns a single object when one id is requested', async () => {
    const response = await fetch(`${LOCATION_ENDPOINT}/1`);

    const body = (await response.json()) as GetLocationsByIdsResponseDto;
    expect(Array.isArray(body)).toBe(false);
    expect((body as LocationApiDto).id).toBe(1);
  });

  it('filters the location list by type', async () => {
    const response = await fetch(`${LOCATION_ENDPOINT}?type=Cluster`);

    const body = (await response.json()) as GetLocationsListResponseDto;
    expect(body.results.length).toBeGreaterThan(0);
    expect(body.results.every((location) => location.type === 'Cluster')).toBe(true);
  });

  it('serves a 404 for the reserved missing id', async () => {
    const response = await fetch(`${LOCATION_ENDPOINT}/9999`);

    expect(response.status).toBe(404);
  });
});
