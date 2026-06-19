import type { Character } from '@/core/domain/entities/character.entity';
import type { Episode } from '@/core/domain/entities/episode.entity';

/**
 * Filter criteria for querying episodes. All fields are optional.
 * `code` filters by season/episode code (e.g. "S01" for a whole season).
 */
export interface EpisodeFilters {
  name?: string;
  code?: string;
}

/**
 * A single page of episodes plus the pagination metadata the presentation
 * layer needs to render controls.
 */
export interface EpisodePage {
  episodes: Episode[];
  page: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetEpisodesQuery {
  page: number;
  filters: EpisodeFilters;
  signal?: AbortSignal;
}

export interface GetEpisodeByIdQuery {
  id: number;
  signal?: AbortSignal;
}

export interface GetCharactersByIdsQuery {
  ids: number[];
  signal?: AbortSignal;
}

/**
 * Port for the episodes feature. Separate from `CharacterRepository`. It also
 * exposes `getCharactersByIds` because the episode detail shows the characters
 * that appear in an episode (mirrors `CharacterRepository.getEpisodesByIds`).
 */
export interface EpisodeRepository {
  getEpisodes(query: GetEpisodesQuery): Promise<EpisodePage>;
  getEpisodeById(query: GetEpisodeByIdQuery): Promise<Episode>;
  getCharactersByIds(query: GetCharactersByIdsQuery): Promise<Character[]>;
}
