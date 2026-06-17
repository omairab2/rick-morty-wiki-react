import type {
  CharacterFilters,
  CharacterPage,
  CharacterRepository,
} from '@/core/domain/repositories/character.repository';

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
 * Drop empty/whitespace-only text filters so they are never sent downstream.
 */
function normalizeFilters(filters: CharacterFilters): CharacterFilters {
  const normalized: CharacterFilters = {};

  const name = filters.name?.trim();
  if (name) {
    normalized.name = name;
  }

  if (filters.status) {
    normalized.status = filters.status;
  }

  if (filters.gender) {
    normalized.gender = filters.gender;
  }

  const species = filters.species?.trim();
  if (species) {
    normalized.species = species;
  }

  return normalized;
}

export interface GetCharactersInput {
  page?: number;
  filters?: CharacterFilters;
  signal?: AbortSignal;
}

export interface GetCharactersUseCase {
  execute(input?: GetCharactersInput): Promise<CharacterPage>;
}

export interface GetCharactersUseCaseDependencies {
  repository: CharacterRepository;
}

/**
 * Application use case: fetch a page of characters. Sanitizes pagination and
 * filters, then delegates to the repository port (dependency inversion).
 */
export function createGetCharactersUseCase({
  repository,
}: GetCharactersUseCaseDependencies): GetCharactersUseCase {
  return {
    execute(input = {}) {
      const page = normalizePage(input.page);
      const filters = normalizeFilters(input.filters ?? {});

      return repository.getCharacters({ page, filters, signal: input.signal });
    },
  };
}
