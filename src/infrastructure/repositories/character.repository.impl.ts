import type { GetCharactersRequestDto } from '@/application/dto/character.dto';
import type {
  CharacterFilters,
  CharacterPage,
  CharacterRepository,
  GetCharactersQuery,
} from '@/core/domain/repositories/character.repository';
import { rickMortyClient } from '@/infrastructure/api/rick-morty.client';
import { mapCharacterPage } from '@/infrastructure/mappers/character.mapper';

interface ToRequestDtoArgs {
  page: number;
  filters: CharacterFilters;
}

/**
 * Translate a domain query into the API request DTO. Domain value objects
 * (`Alive`, `Female`) are lowercased to match the API's query-param values.
 */
function toRequestDto({ page, filters }: ToRequestDtoArgs): GetCharactersRequestDto {
  const request: GetCharactersRequestDto = { page };

  if (filters.name) {
    request.name = filters.name;
  }
  if (filters.status) {
    request.status = filters.status.toLowerCase();
  }
  if (filters.gender) {
    request.gender = filters.gender.toLowerCase();
  }
  if (filters.species) {
    request.species = filters.species;
  }

  return request;
}

/**
 * Concrete {@link CharacterRepository} backed by the Rick & Morty API. Forwards
 * the abort `signal` end-to-end so TanStack Query can cancel in-flight requests.
 */
export function createCharacterRepository(): CharacterRepository {
  return {
    async getCharacters({ page, filters, signal }: GetCharactersQuery): Promise<CharacterPage> {
      const request = toRequestDto({ page, filters });
      const response = await rickMortyClient.fetchCharacters({ request, signal });

      return mapCharacterPage({ dto: response, requestedPage: page });
    },
  };
}
