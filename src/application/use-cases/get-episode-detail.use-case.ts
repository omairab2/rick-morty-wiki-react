import type { Character } from '@/core/domain/entities/character.entity';
import type { Episode } from '@/core/domain/entities/episode.entity';
import type { EpisodeRepository } from '@/core/domain/repositories/episode.repository';

export interface EpisodeDetail {
  episode: Episode;
  characters: Character[];
}

export interface GetEpisodeDetailInput {
  id: number;
  signal?: AbortSignal;
}

export interface GetEpisodeDetailUseCase {
  execute(input: GetEpisodeDetailInput): Promise<EpisodeDetail>;
}

export interface GetEpisodeDetailUseCaseDependencies {
  repository: EpisodeRepository;
}

/**
 * Application use case: fetch an episode and the characters that appear in it.
 *
 * The two fetches are sequential by necessity — the character ids come from the
 * episode. When the episode has no characters, the second fetch is skipped.
 *
 * Errors from `getEpisodeById` (e.g. an `HttpError` with status 404) are not
 * caught here: they propagate unchanged so the presentation layer can tell
 * "not found" from a network/other error.
 */
export function createGetEpisodeDetailUseCase({
  repository,
}: GetEpisodeDetailUseCaseDependencies): GetEpisodeDetailUseCase {
  return {
    async execute({ id, signal }) {
      const episode = await repository.getEpisodeById({ id, signal });

      if (episode.characterIds.length === 0) {
        return { episode, characters: [] };
      }

      const characters = await repository.getCharactersByIds({
        ids: episode.characterIds,
        signal,
      });

      return { episode, characters };
    },
  };
}
