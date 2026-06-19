import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';

import { rickMortyClient } from '@/infrastructure/api/rick-morty.client';
import { server } from '@/infrastructure/mocks/server';
import { createEpisodeRepository } from '@/infrastructure/repositories/episode.repository.impl';
import { HttpError } from '@/shared/errors/http.error';
import { env } from '@/shared/config/env';

const EPISODE_ENDPOINT = `${env.apiBaseUrl}/episode`;
const EMPTY_LIST = { info: { count: 0, pages: 0, next: null, prev: null }, results: [] };

describe('createEpisodeRepository · getEpisodes', () => {
  it('maps a successful list response to an EpisodePage', async () => {
    const repository = createEpisodeRepository();

    const page = await repository.getEpisodes({ page: 1, filters: {} });

    expect(page.episodes).toHaveLength(3);
    expect(page.episodes[0]).toMatchObject({ id: 1, name: 'Pilot', code: 'S01E01' });
    expect(page).toMatchObject({
      page: 1,
      totalCount: 3,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    });
  });

  it('sends the name and code filters as API query params (code maps to episode)', async () => {
    let capturedUrl = '';
    server.use(
      http.get(EPISODE_ENDPOINT, ({ request }) => {
        capturedUrl = request.url;
        return HttpResponse.json(EMPTY_LIST);
      }),
    );

    const repository = createEpisodeRepository();
    await repository.getEpisodes({ page: 2, filters: { name: 'Pilot', code: 'S01' } });

    const url = new URL(capturedUrl);
    expect(url.searchParams.get('page')).toBe('2');
    expect(url.searchParams.get('name')).toBe('Pilot');
    expect(url.searchParams.get('episode')).toBe('S01');
  });

  it('returns only the episodes matching the season filter', async () => {
    const repository = createEpisodeRepository();

    const page = await repository.getEpisodes({ page: 1, filters: { code: 'S02' } });

    expect(page.episodes).toHaveLength(1);
    expect(page.episodes[0]?.code).toBe('S02E01');
  });

  it('treats a 404 list response as an empty page (no results)', async () => {
    server.use(
      http.get(EPISODE_ENDPOINT, () =>
        HttpResponse.json({ error: 'There is nothing here' }, { status: 404 }),
      ),
    );
    const repository = createEpisodeRepository();

    const page = await repository.getEpisodes({ page: 2, filters: { name: 'zzzzz' } });

    expect(page).toEqual({
      episodes: [],
      page: 2,
      totalPages: 0,
      totalCount: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    });
  });
});

describe('createEpisodeRepository · getEpisodeById', () => {
  it('fetches a single episode by id and maps it', async () => {
    const repository = createEpisodeRepository();

    const episode = await repository.getEpisodeById({ id: 1 });

    expect(episode).toMatchObject({ id: 1, code: 'S01E01', characterIds: [1, 2] });
  });

  it('propagates a 404 as an HttpError', async () => {
    const repository = createEpisodeRepository();

    const error = await repository.getEpisodeById({ id: 9999 }).catch((reason: unknown) => reason);

    expect(error).toBeInstanceOf(HttpError);
    expect((error as HttpError).status).toBe(404);
  });
});

describe('createEpisodeRepository · getCharactersByIds', () => {
  it('returns no characters and skips the client when ids is empty', async () => {
    const fetchSpy = vi.spyOn(rickMortyClient, 'fetchCharactersByIds');
    const repository = createEpisodeRepository();

    const characters = await repository.getCharactersByIds({ ids: [] });

    expect(characters).toEqual([]);
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it('fetches and maps the characters for the given ids', async () => {
    const repository = createEpisodeRepository();

    const characters = await repository.getCharactersByIds({ ids: [1, 2] });

    expect(characters).toHaveLength(2);
    expect(characters[0]).toMatchObject({ id: 1, name: 'Rick Sanchez' });
    expect(characters[1]).toMatchObject({ id: 2, name: 'Morty Smith' });
  });
});
