/**
 * Canonical lifecycle status of a character. The `unknown` value matches the
 * lowercase string the domain uses when the status is not established.
 */
export const CharacterStatus = {
  Alive: 'Alive',
  Dead: 'Dead',
  Unknown: 'unknown',
} as const;

export type CharacterStatus = (typeof CharacterStatus)[keyof typeof CharacterStatus];

/**
 * Canonical gender of a character.
 */
export const CharacterGender = {
  Female: 'Female',
  Male: 'Male',
  Genderless: 'Genderless',
  Unknown: 'unknown',
} as const;

export type CharacterGender = (typeof CharacterGender)[keyof typeof CharacterGender];

/**
 * Reference to a named place (origin or last known location) the character is
 * linked to. `url` is empty when the API has no resource for it.
 */
export interface CharacterPlaceRef {
  name: string;
  url: string;
}

/**
 * Domain entity for a Rick & Morty character. Field names are domain-friendly
 * (`imageUrl`, `episodeCount`) and decoupled from the raw API shape, which is
 * translated by the infrastructure mapper.
 */
export interface Character {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  type: string;
  gender: CharacterGender;
  origin: CharacterPlaceRef;
  location: CharacterPlaceRef;
  imageUrl: string;
  episodeCount: number;
}

/**
 * Pure domain predicate: whether a character is currently alive.
 */
export function isCharacterAlive(character: Pick<Character, 'status'>): boolean {
  return character.status === CharacterStatus.Alive;
}
