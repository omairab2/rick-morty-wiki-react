import type { GetCharactersRequestDto } from '@/application/dto/character.dto';
import { normalizeEpisodesResponse } from '@/application/dto/episode.dto';
import type { Character } from '@/core/domain/entities/character.entity';
import type { Episode } from '@/core/domain/entities/episode.entity';
import type {
  CharacterFilters,
  CharacterPage,
  CharacterRepository,
  GetCharacterByIdQuery,
  GetCharactersQuery,
  GetEpisodesByIdsQuery,
} from '@/core/domain/repositories/character.repository';
import { rickMortyClient } from '@/infrastructure/api/rick-morty.client';
import { mapCharacter, mapCharacterPage } from '@/infrastructure/mappers/character.mapper';
import { mapEpisode } from '@/infrastructure/mappers/episode.mapper';
import { HttpError } from '@/shared/errors/http.error';

const NOT_FOUND_STATUS = 404;

interface ToRequestDtoArgs {
  page: number;
  filters: CharacterFilters;
}

/**
 * The API answers `404` when a filter (or an out-of-range page) matches nothing.
 * That is an empty result, not a failure, so it maps to an empty page.
 */
function emptyCharacterPage(page: number): CharacterPage {
  return {
    characters: [],
    page,
    totalPages: 0,
    totalCount: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  };
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
 * HTTP errors (e.g. a 404 from `/character/:id`) propagate unchanged.
 */
export function createCharacterRepository(): CharacterRepository {
  return {
    async getCharacters({ page, filters, signal }: GetCharactersQuery): Promise<CharacterPage> {
      const request = toRequestDto({ page, filters });

      try {
        const response = await rickMortyClient.fetchCharacters({ request, signal });

        return mapCharacterPage({ dto: response, requestedPage: page });
      } catch (error) {
        if (error instanceof HttpError && error.status === NOT_FOUND_STATUS) {
          return emptyCharacterPage(page);
        }

        throw error;
      }
    },

    async getCharacterById({ id, signal }: GetCharacterByIdQuery): Promise<Character> {
      const dto = await rickMortyClient.fetchCharacterById({ id, signal });

      return mapCharacter(dto);
    },

    async getEpisodesByIds({ ids, signal }: GetEpisodesByIdsQuery): Promise<Episode[]> {
      if (ids.length === 0) {
        return [];
      }

      const response = await rickMortyClient.fetchEpisodesByIds({ ids, signal });

      return normalizeEpisodesResponse(response).map(mapEpisode);
    },
  };
}
