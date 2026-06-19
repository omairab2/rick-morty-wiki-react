import type { EpisodeApiDto, GetEpisodesListResponseDto } from '@/application/dto/episode.dto';
import type { Episode } from '@/core/domain/entities/episode.entity';
import type { EpisodePage } from '@/core/domain/repositories/episode.repository';

/**
 * Extract the trailing numeric id from a resource URL
 * (e.g. ".../character/42" → 42). Invalid segments yield `NaN`.
 */
function extractIdFromUrl(url: string): number {
  return Number.parseInt(url.split('/').pop() ?? '', 10);
}

/**
 * Map a raw API episode DTO to the domain entity, renaming the snake_case /
 * API-specific fields (`air_date`, `episode`) to domain-friendly names and
 * deriving `characterIds` from the `characters` URLs.
 */
export function mapEpisode(dto: EpisodeApiDto): Episode {
  return {
    id: dto.id,
    name: dto.name,
    code: dto.episode,
    airDate: dto.air_date,
    characterIds: dto.characters.map(extractIdFromUrl).filter((id) => !Number.isNaN(id)),
  };
}

export interface MapEpisodePageArgs {
  dto: GetEpisodesListResponseDto;
  requestedPage: number;
}

/**
 * Map the API list response to a domain {@link EpisodePage}, deriving the
 * pagination flags from the API's `next`/`prev` links.
 */
export function mapEpisodePage({ dto, requestedPage }: MapEpisodePageArgs): EpisodePage {
  return {
    episodes: dto.results.map(mapEpisode),
    page: requestedPage,
    totalPages: dto.info.pages,
    totalCount: dto.info.count,
    hasNextPage: dto.info.next !== null,
    hasPreviousPage: dto.info.prev !== null,
  };
}
