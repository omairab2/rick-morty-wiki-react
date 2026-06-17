import type {
  Character,
  CharacterGender,
  CharacterStatus,
} from '@/core/domain/entities/character.entity';
import type { Episode } from '@/core/domain/entities/episode.entity';

/**
 * Filter criteria for querying characters. All fields are optional; an empty
 * object means "no filters".
 */
export interface CharacterFilters {
  name?: string;
  status?: CharacterStatus;
  gender?: CharacterGender;
  species?: string;
}

/**
 * A single page of characters plus the pagination metadata the presentation
 * layer needs to render controls.
 */
export interface CharacterPage {
  characters: Character[];
  page: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Arguments accepted by {@link CharacterRepository.getCharacters}.
 */
export interface GetCharactersQuery {
  page: number;
  filters: CharacterFilters;
  signal?: AbortSignal;
}

/**
 * Arguments accepted by {@link CharacterRepository.getCharacterById}.
 */
export interface GetCharacterByIdQuery {
  id: number;
  signal?: AbortSignal;
}

/**
 * Arguments accepted by {@link CharacterRepository.getEpisodesByIds}.
 */
export interface GetEpisodesByIdsQuery {
  ids: number[];
  signal?: AbortSignal;
}

/**
 * Port the application layer depends on. Infrastructure provides the concrete
 * implementation; the domain never knows about HTTP, the API, or React.
 */
export interface CharacterRepository {
  getCharacters(query: GetCharactersQuery): Promise<CharacterPage>;
  getCharacterById(query: GetCharacterByIdQuery): Promise<Character>;
  getEpisodesByIds(query: GetEpisodesByIdsQuery): Promise<Episode[]>;
}
