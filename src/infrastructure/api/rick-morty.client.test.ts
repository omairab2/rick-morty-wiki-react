import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { rickMortyClient } from '@/infrastructure/api/rick-morty.client';
import { server } from '@/infrastructure/mocks/server';
import { env } from '@/shared/config/env';

const CHARACTER_ENDPOINT = `${env.apiBaseUrl}/character`;
const EMPTY_RESPONSE = { info: { count: 0, pages: 0, next: null, prev: null }, results: [] };

describe('rickMortyClient.fetchCharacters', () => {
  it('returns the raw response DTO from the API', async () => {
    const response = await rickMortyClient.fetchCharacters({ request: { page: 1 } });

    expect(response.results).toHaveLength(2);
    expect(response.info.count).toBe(2);
  });

  it('builds the query string from the request DTO', async () => {
    let capturedUrl = '';
    server.use(
      http.get(CHARACTER_ENDPOINT, ({ request }) => {
        capturedUrl = request.url;
        return HttpResponse.json(EMPTY_RESPONSE);
      }),
    );

    await rickMortyClient.fetchCharacters({ request: { name: 'Rick', status: 'alive', page: 3 } });

    const url = new URL(capturedUrl);
    expect(url.pathname).toBe('/api/character');
    expect(url.searchParams.get('name')).toBe('Rick');
    expect(url.searchParams.get('status')).toBe('alive');
    expect(url.searchParams.get('page')).toBe('3');
  });

  it('omits params that are not set', async () => {
    let capturedUrl = '';
    server.use(
      http.get(CHARACTER_ENDPOINT, ({ request }) => {
        capturedUrl = request.url;
        return HttpResponse.json(EMPTY_RESPONSE);
      }),
    );

    await rickMortyClient.fetchCharacters({ request: {} });

    expect(new URL(capturedUrl).search).toBe('');
  });
});
