import type {
  GetCharactersRequestDto,
  GetCharactersResponseDto,
} from '@/application/dto/character.dto';
import { httpClient } from '@/infrastructure/http/http-client';

const CHARACTER_RESOURCE_PATH = '/character';

/**
 * Build the `/character` query string from a request DTO, omitting any param
 * that is not set so the API receives only the filters that were provided.
 */
function buildCharacterQuery(request: GetCharactersRequestDto): string {
  const params = new URLSearchParams();

  if (request.name) {
    params.set('name', request.name);
  }
  if (request.status) {
    params.set('status', request.status);
  }
  if (request.gender) {
    params.set('gender', request.gender);
  }
  if (request.species) {
    params.set('species', request.species);
  }
  if (request.page !== undefined) {
    params.set('page', String(request.page));
  }

  const query = params.toString();

  return query ? `?${query}` : '';
}

export interface FetchCharactersArgs {
  request: GetCharactersRequestDto;
  signal?: AbortSignal;
}

/**
 * Fetch a page of characters from the Rick & Morty API. Returns the raw
 * response DTO untouched — translation to the domain happens in the mapper.
 */
function fetchCharacters({
  request,
  signal,
}: FetchCharactersArgs): Promise<GetCharactersResponseDto> {
  const path = `${CHARACTER_RESOURCE_PATH}${buildCharacterQuery(request)}`;

  return httpClient.get<GetCharactersResponseDto>({ path, signal });
}

export const rickMortyClient = {
  fetchCharacters,
};
