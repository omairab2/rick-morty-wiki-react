import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';

import { CharacterStatus } from '@/core/domain/entities/character.entity';
import { rickMortyClient } from '@/infrastructure/api/rick-morty.client';
import { HttpError } from '@/shared/errors/http.error';
import { characterNotFoundHandler } from '@/infrastructure/mocks/handlers';
import { server } from '@/infrastructure/mocks/server';
import { createCharacterRepository } from '@/infrastructure/repositories/character.repository.impl';
import { env } from '@/shared/config/env';

const CHARACTER_ENDPOINT = `${env.apiBaseUrl}/character`;
const EMPTY_RESPONSE = { info: { count: 0, pages: 0, next: null, prev: null }, results: [] };

describe('createCharacterRepository · getCharacters', () => {
  it('maps a successful API response to a domain CharacterPage', async () => {
    const repository = createCharacterRepository();

    const page = await repository.getCharacters({ page: 1, filters: {} });

    expect(page.characters).toHaveLength(2);
    expect(page.characters[0]).toMatchObject({
      id: 1,
      name: 'Rick Sanchez',
      status: CharacterStatus.Alive,
      episodeCount: 2,
    });
    expect(page).toMatchObject({
      page: 1,
      totalCount: 2,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    });
  });

  it('sends domain filters as lowercase API query params', async () => {
    let capturedUrl = '';
    server.use(
      http.get(CHARACTER_ENDPOINT, ({ request }) => {
        capturedUrl = request.url;
        return HttpResponse.json(EMPTY_RESPONSE);
      }),
    );

    const repository = createCharacterRepository();
    await repository.getCharacters({
      page: 2,
      filters: { name: 'Rick', status: CharacterStatus.Alive },
    });

    const url = new URL(capturedUrl);
    expect(url.searchParams.get('page')).toBe('2');
    expect(url.searchParams.get('name')).toBe('Rick');
    expect(url.searchParams.get('status')).toBe('alive');
  });

  it('propagates a 404 response as an HttpError', async () => {
    server.use(characterNotFoundHandler);
    const repository = createCharacterRepository();

    const error = await repository
      .getCharacters({ page: 1, filters: {} })
      .catch((reason: unknown) => reason);

    expect(error).toBeInstanceOf(HttpError);
    expect((error as HttpError).status).toBe(404);
  });

  it('forwards the abort signal so requests can be cancelled', async () => {
    const controller = new AbortController();
    controller.abort();
    const repository = createCharacterRepository();

    await expect(
      repository.getCharacters({ page: 1, filters: {}, signal: controller.signal }),
    ).rejects.toThrow();
  });
});

describe('createCharacterRepository · getCharacterById', () => {
  it('fetches a character by id and maps it to the domain', async () => {
    const repository = createCharacterRepository();

    const character = await repository.getCharacterById({ id: 1 });

    expect(character).toMatchObject({
      id: 1,
      name: 'Rick Sanchez',
      status: CharacterStatus.Alive,
      episodeIds: [1, 2],
    });
  });

  it('propagates a 404 as an HttpError', async () => {
    const repository = createCharacterRepository();

    const error = await repository
      .getCharacterById({ id: 9999 })
      .catch((reason: unknown) => reason);

    expect(error).toBeInstanceOf(HttpError);
    expect((error as HttpError).status).toBe(404);
  });
});

describe('createCharacterRepository · getEpisodesByIds', () => {
  it('fetches and maps the episodes for the given ids', async () => {
    const repository = createCharacterRepository();

    const episodes = await repository.getEpisodesByIds({ ids: [1, 2] });

    expect(episodes).toHaveLength(2);
    expect(episodes[0]).toEqual({
      id: 1,
      name: 'Episode 1',
      code: 'S01E01',
      airDate: 'December 2, 2013',
    });
  });

  it('returns no episodes and skips the client when ids is empty', async () => {
    const fetchSpy = vi.spyOn(rickMortyClient, 'fetchEpisodesByIds');
    const repository = createCharacterRepository();

    const episodes = await repository.getEpisodesByIds({ ids: [] });

    expect(episodes).toEqual([]);
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
