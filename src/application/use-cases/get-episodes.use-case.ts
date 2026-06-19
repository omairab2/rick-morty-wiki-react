import type {
  EpisodeFilters,
  EpisodePage,
  EpisodeRepository,
} from '@/core/domain/repositories/episode.repository';

const FIRST_PAGE = 1;

/**
 * Clamp any page value to a valid 1-based integer. Invalid inputs — `0`,
 * negatives, fractionals, `NaN`, `Infinity`, `undefined` — fall back to the
 * first page.
 */
function normalizePage(page: number | undefined): number {
  if (page === undefined || !Number.isFinite(page)) {
    return FIRST_PAGE;
  }

  const truncated = Math.trunc(page);

  return truncated < FIRST_PAGE ? FIRST_PAGE : truncated;
}

/**
 * Drop empty/whitespace-only filters so they are never sent downstream.
 */
function normalizeFilters(filters: EpisodeFilters): EpisodeFilters {
  const normalized: EpisodeFilters = {};

  const name = filters.name?.trim();
  if (name) {
    normalized.name = name;
  }

  const code = filters.code?.trim();
  if (code) {
    normalized.code = code;
  }

  return normalized;
}

export interface GetEpisodesInput {
  page?: number;
  filters?: EpisodeFilters;
  signal?: AbortSignal;
}

export interface GetEpisodesUseCase {
  execute(input?: GetEpisodesInput): Promise<EpisodePage>;
}

export interface GetEpisodesUseCaseDependencies {
  repository: EpisodeRepository;
}

/**
 * Application use case: fetch a page of episodes. Sanitizes pagination and
 * filters, then delegates to the repository port (dependency inversion).
 */
export function createGetEpisodesUseCase({
  repository,
}: GetEpisodesUseCaseDependencies): GetEpisodesUseCase {
  return {
    execute(input = {}) {
      const page = normalizePage(input.page);
      const filters = normalizeFilters(input.filters ?? {});

      return repository.getEpisodes({ page, filters, signal: input.signal });
    },
  };
}
