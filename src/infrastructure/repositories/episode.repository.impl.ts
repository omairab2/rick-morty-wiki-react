import { normalizeCharactersResponse } from '@/application/dto/character.dto';
import {
  normalizeEpisodesResponse,
  type GetEpisodesRequestDto,
} from '@/application/dto/episode.dto';
import type { Character } from '@/core/domain/entities/character.entity';
import type { Episode } from '@/core/domain/entities/episode.entity';
import type {
  EpisodeFilters,
  EpisodePage,
  EpisodeRepository,
  GetCharactersByIdsQuery,
  GetEpisodeByIdQuery,
  GetEpisodesQuery,
} from '@/core/domain/repositories/episode.repository';
import { rickMortyClient } from '@/infrastructure/api/rick-morty.client';
import { mapCharacter } from '@/infrastructure/mappers/character.mapper';
import { mapEpisode, mapEpisodePage } from '@/infrastructure/mappers/episode.mapper';
import { HttpError } from '@/shared/errors/http.error';

const NOT_FOUND_STATUS = 404;

interface ToRequestDtoArgs {
  page: number;
  filters: EpisodeFilters;
}

/**
 * The API answers `404` when a filter (or an out-of-range page) matches nothing.
 * That is an empty result, not a failure, so it maps to an empty page.
 */
function emptyEpisodePage(page: number): EpisodePage {
  return {
    episodes: [],
    page,
    totalPages: 0,
    totalCount: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  };
}

/**
 * Translate a domain query into the API request DTO. The domain `code` filter
 * maps to the API's `episode` query param.
 */
function toRequestDto({ page, filters }: ToRequestDtoArgs): GetEpisodesRequestDto {
  const request: GetEpisodesRequestDto = { page };

  if (filters.name) {
    request.name = filters.name;
  }
  if (filters.code) {
    request.episode = filters.code;
  }

  return request;
}

/**
 * Concrete {@link EpisodeRepository} backed by the Rick & Morty API. It uses the
 * shared HTTP client and mappers directly — it never depends on
 * `CharacterRepository`, even though it fetches characters for the detail view.
 * Forwards the abort `signal`; HTTP errors (e.g. a 404) propagate unchanged.
 */
export function createEpisodeRepository(): EpisodeRepository {
  return {
    async getEpisodes({ page, filters, signal }: GetEpisodesQuery): Promise<EpisodePage> {
      const request = toRequestDto({ page, filters });

      try {
        const response = await rickMortyClient.fetchEpisodes({ request, signal });

        return mapEpisodePage({ dto: response, requestedPage: page });
      } catch (error) {
        if (error instanceof HttpError && error.status === NOT_FOUND_STATUS) {
          return emptyEpisodePage(page);
        }

        throw error;
      }
    },

    async getEpisodeById({ id, signal }: GetEpisodeByIdQuery): Promise<Episode> {
      // The `/episode/:id` endpoint returns a single object; reuse the by-ids
      // call with one id and take the first (normalized) result.
      const response = await rickMortyClient.fetchEpisodesByIds({ ids: [id], signal });
      const [episodeDto] = normalizeEpisodesResponse(response);

      return mapEpisode(episodeDto);
    },

    async getCharactersByIds({ ids, signal }: GetCharactersByIdsQuery): Promise<Character[]> {
      if (ids.length === 0) {
        return [];
      }

      const response = await rickMortyClient.fetchCharactersByIds({ ids, signal });

      return normalizeCharactersResponse(response).map(mapCharacter);
    },
  };
}
