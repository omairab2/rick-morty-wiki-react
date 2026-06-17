import type { CharacterApiDto, GetCharactersResponseDto } from '@/application/dto/character.dto';
import {
  CharacterGender,
  CharacterStatus,
  type Character,
} from '@/core/domain/entities/character.entity';
import type { CharacterPage } from '@/core/domain/repositories/character.repository';

const STATUS_BY_API_VALUE: Record<string, CharacterStatus> = {
  alive: CharacterStatus.Alive,
  dead: CharacterStatus.Dead,
  unknown: CharacterStatus.Unknown,
};

const GENDER_BY_API_VALUE: Record<string, CharacterGender> = {
  female: CharacterGender.Female,
  male: CharacterGender.Male,
  genderless: CharacterGender.Genderless,
  unknown: CharacterGender.Unknown,
};

/**
 * Narrow a raw API status to the domain value object. Unrecognized values fall
 * back to `unknown` instead of throwing, so unexpected API data never breaks
 * rendering.
 */
function toCharacterStatus(value: string): CharacterStatus {
  return STATUS_BY_API_VALUE[value.toLowerCase()] ?? CharacterStatus.Unknown;
}

/**
 * Narrow a raw API gender to the domain value object, falling back to `unknown`.
 */
function toCharacterGender(value: string): CharacterGender {
  return GENDER_BY_API_VALUE[value.toLowerCase()] ?? CharacterGender.Unknown;
}

/**
 * Map a raw API character DTO to the domain entity.
 */
export function mapCharacter(dto: CharacterApiDto): Character {
  return {
    id: dto.id,
    name: dto.name,
    status: toCharacterStatus(dto.status),
    species: dto.species,
    type: dto.type,
    gender: toCharacterGender(dto.gender),
    origin: { name: dto.origin.name, url: dto.origin.url },
    location: { name: dto.location.name, url: dto.location.url },
    imageUrl: dto.image,
    episodeCount: dto.episode.length,
  };
}

export interface MapCharacterPageArgs {
  dto: GetCharactersResponseDto;
  requestedPage: number;
}

/**
 * Map the API list response to a domain {@link CharacterPage}, deriving the
 * pagination flags from the API's `next`/`prev` links.
 */
export function mapCharacterPage({ dto, requestedPage }: MapCharacterPageArgs): CharacterPage {
  return {
    characters: dto.results.map(mapCharacter),
    page: requestedPage,
    totalPages: dto.info.pages,
    totalCount: dto.info.count,
    hasNextPage: dto.info.next !== null,
    hasPreviousPage: dto.info.prev !== null,
  };
}
