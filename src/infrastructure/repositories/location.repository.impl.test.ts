import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';

import { rickMortyClient } from '@/infrastructure/api/rick-morty.client';
import { server } from '@/infrastructure/mocks/server';
import { createLocationRepository } from '@/infrastructure/repositories/location.repository.impl';
import { HttpError } from '@/shared/errors/http.error';
import { env } from '@/shared/config/env';

const LOCATION_ENDPOINT = `${env.apiBaseUrl}/location`;
const EMPTY_LIST = { info: { count: 0, pages: 0, next: null, prev: null }, results: [] };

describe('createLocationRepository · getLocations', () => {
  it('maps a successful list response to a LocationPage', async () => {
    const repository = createLocationRepository();

    const page = await repository.getLocations({ page: 1, filters: {} });

    expect(page.locations).toHaveLength(3);
    expect(page.locations[0]).toMatchObject({ id: 1, name: 'Earth (C-137)', type: 'Planet' });
    expect(page).toMatchObject({
      page: 1,
      totalCount: 3,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    });
  });

  it('sends the name, type, and dimension filters as API query params', async () => {
    let capturedUrl = '';
    server.use(
      http.get(LOCATION_ENDPOINT, ({ request }) => {
        capturedUrl = request.url;
        return HttpResponse.json(EMPTY_LIST);
      }),
    );

    const repository = createLocationRepository();
    await repository.getLocations({
      page: 2,
      filters: { name: 'Earth', type: 'Planet', dimension: 'C-137' },
    });

    const url = new URL(capturedUrl);
    expect(url.searchParams.get('page')).toBe('2');
    expect(url.searchParams.get('name')).toBe('Earth');
    expect(url.searchParams.get('type')).toBe('Planet');
    expect(url.searchParams.get('dimension')).toBe('C-137');
  });

  it('returns only the locations matching the type filter', async () => {
    const repository = createLocationRepository();

    const page = await repository.getLocations({ page: 1, filters: { type: 'Space station' } });

    expect(page.locations).toHaveLength(1);
    expect(page.locations[0]?.name).toBe('Citadel of Ricks');
  });

  it('treats a 404 list response as an empty page (no results)', async () => {
    server.use(
      http.get(LOCATION_ENDPOINT, () =>
        HttpResponse.json({ error: 'There is nothing here' }, { status: 404 }),
      ),
    );
    const repository = createLocationRepository();

    const page = await repository.getLocations({ page: 2, filters: { name: 'zzzzz' } });

    expect(page).toEqual({
      locations: [],
      page: 2,
      totalPages: 0,
      totalCount: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    });
  });
});

describe('createLocationRepository · getLocationById', () => {
  it('fetches a single location by id and maps it', async () => {
    const repository = createLocationRepository();

    const location = await repository.getLocationById({ id: 1 });

    expect(location).toMatchObject({ id: 1, type: 'Planet', residentIds: [1, 2] });
  });

  it('propagates a 404 as an HttpError', async () => {
    const repository = createLocationRepository();

    const error = await repository.getLocationById({ id: 9999 }).catch((reason: unknown) => reason);

    expect(error).toBeInstanceOf(HttpError);
    expect((error as HttpError).status).toBe(404);
  });
});

describe('createLocationRepository · getCharactersByIds', () => {
  it('returns no residents and skips the client when ids is empty', async () => {
    const fetchSpy = vi.spyOn(rickMortyClient, 'fetchCharactersByIds');
    const repository = createLocationRepository();

    const residents = await repository.getCharactersByIds({ ids: [] });

    expect(residents).toEqual([]);
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it('fetches and maps the residents for the given ids', async () => {
    const repository = createLocationRepository();

    const residents = await repository.getCharactersByIds({ ids: [1, 2] });

    expect(residents).toHaveLength(2);
    expect(residents[0]).toMatchObject({ id: 1, name: 'Rick Sanchez' });
    expect(residents[1]).toMatchObject({ id: 2, name: 'Morty Smith' });
  });
});
