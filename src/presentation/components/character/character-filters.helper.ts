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

export const STATUS_FILTER_OPTIONS: FilterOption[] = [
  { value: CharacterStatus.Alive, label: 'Alive' },
  { value: CharacterStatus.Dead, label: 'Dead' },
  { value: CharacterStatus.Unknown, label: 'Unknown' },
];

export const GENDER_FILTER_OPTIONS: FilterOption[] = [
  { value: CharacterGender.Female, label: 'Female' },
  { value: CharacterGender.Male, label: 'Male' },
  { value: CharacterGender.Genderless, label: 'Genderless' },
  { value: CharacterGender.Unknown, label: 'Unknown' },
];

/** Map a Select value to the upstream filter value ("all" clears the filter). */
export function toFilterValue(selectValue: string): string {
  return selectValue === FILTER_ALL_VALUE ? '' : selectValue;
}

/** Map an upstream filter value to the Select value (empty shows the "All" option). */
export function toSelectValue(filterValue: string): string {
  return filterValue === '' ? FILTER_ALL_VALUE : filterValue;
}
