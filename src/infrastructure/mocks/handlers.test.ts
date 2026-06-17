import { describe, expect, it } from 'vitest';

import type { GetCharactersResponseDto } from '@/application/dto/character.dto';
import { characterListResponse, characterNotFoundHandler } from '@/infrastructure/mocks/handlers';
import { server } from '@/infrastructure/mocks/server';
import { env } from '@/shared/config/env';

const CHARACTER_ENDPOINT = `${env.apiBaseUrl}/character`;

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
});
