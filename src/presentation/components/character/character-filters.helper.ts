import { CharacterGender, CharacterStatus } from '@/core/domain/entities/character.entity';

/**
 * Sentinel value for the "All" option. Radix Select forbids an empty-string
 * item value, so we use this sentinel and translate it to/from the empty
 * filter value at the component boundary.
 */
export const FILTER_ALL_VALUE = 'all';

export interface FilterOption {
  value: string;
  label: string;
}

/**
 * Filter options expose the lowercase API query value as `value` and the
 * capitalized domain text as `label`. The API only accepts lowercase status and
 * gender values (e.g. `genderless`), so the option value — which flows to the
 * URL and then the request — is the lowercase form, decoupled from the display
 * label.
 */
export const STATUS_FILTER_OPTIONS: FilterOption[] = [
  { value: CharacterStatus.Alive.toLowerCase(), label: 'Alive' },
  { value: CharacterStatus.Dead.toLowerCase(), label: 'Dead' },
  { value: CharacterStatus.Unknown.toLowerCase(), label: 'Unknown' },
];

export const GENDER_FILTER_OPTIONS: FilterOption[] = [
  { value: CharacterGender.Female.toLowerCase(), label: 'Female' },
  { value: CharacterGender.Male.toLowerCase(), label: 'Male' },
  { value: CharacterGender.Genderless.toLowerCase(), label: 'Genderless' },
  { value: CharacterGender.Unknown.toLowerCase(), label: 'Unknown' },
];

const STATUS_BY_FILTER_VALUE: Record<string, CharacterStatus> = {
  [CharacterStatus.Alive.toLowerCase()]: CharacterStatus.Alive,
  [CharacterStatus.Dead.toLowerCase()]: CharacterStatus.Dead,
  [CharacterStatus.Unknown.toLowerCase()]: CharacterStatus.Unknown,
};

const GENDER_BY_FILTER_VALUE: Record<string, CharacterGender> = {
  [CharacterGender.Female.toLowerCase()]: CharacterGender.Female,
  [CharacterGender.Male.toLowerCase()]: CharacterGender.Male,
  [CharacterGender.Genderless.toLowerCase()]: CharacterGender.Genderless,
  [CharacterGender.Unknown.toLowerCase()]: CharacterGender.Unknown,
};

/**
 * Map a status filter value to the domain status; undefined if unrecognized.
 * Case-insensitive so legacy capitalized URLs (e.g. `?status=Alive`) still work.
 */
export function toStatusFilter(value: string): CharacterStatus | undefined {
  return STATUS_BY_FILTER_VALUE[value.toLowerCase()];
}

/**
 * Map a gender filter value to the domain gender; undefined if unrecognized.
 * Case-insensitive so legacy capitalized URLs (e.g. `?gender=Genderless`) still work.
 */
export function toGenderFilter(value: string): CharacterGender | undefined {
  return GENDER_BY_FILTER_VALUE[value.toLowerCase()];
}

/** Map a Select value to the upstream filter value ("all" clears the filter). */
export function toFilterValue(selectValue: string): string {
  return selectValue === FILTER_ALL_VALUE ? '' : selectValue;
}

/** Map an upstream filter value to the Select value (empty shows the "All" option). */
export function toSelectValue(filterValue: string): string {
  return filterValue === '' ? FILTER_ALL_VALUE : filterValue;
}
