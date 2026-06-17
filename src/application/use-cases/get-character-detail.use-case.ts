import type { Character } from '@/core/domain/entities/character.entity';
import type { Episode } from '@/core/domain/entities/episode.entity';
import type { CharacterRepository } from '@/core/domain/repositories/character.repository';

export interface CharacterDetail {
  character: Character;
  episodes: Episode[];
}

export interface GetCharacterDetailInput {
  id: number;
  signal?: AbortSignal;
}

export interface GetCharacterDetailUseCase {
  execute(input: GetCharacterDetailInput): Promise<CharacterDetail>;
}

export interface GetCharacterDetailUseCaseDependencies {
  repository: CharacterRepository;
}

/**
 * Application use case: fetch a character and the episodes it appears in.
 *
 * The two fetches are sequential by necessity — the episode ids come from the
 * character, so `getEpisodesByIds` cannot run until `getCharacterById` resolves.
 * When the character has no episodes, the second fetch is skipped.
 *
 * Errors from `getCharacterById` (e.g. an `HttpError` with status 404) are not
 * caught here: they propagate unchanged so the presentation layer can tell
 * "not found" from a network/other error.
 */
export function createGetCharacterDetailUseCase({
  repository,
}: GetCharacterDetailUseCaseDependencies): GetCharacterDetailUseCase {
  return {
    async execute({ id, signal }) {
      const character = await repository.getCharacterById({ id, signal });

      if (character.episodeIds.length === 0) {
        return { character, episodes: [] };
      }

      const episodes = await repository.getEpisodesByIds({ ids: character.episodeIds, signal });

      return { character, episodes };
    },
  };
}
