import { describe, expect, it } from 'vitest';

import { CharacterGender, CharacterStatus } from '@/core/domain/entities/character.entity';
import {
  FILTER_ALL_VALUE,
  GENDER_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
  toFilterValue,
  toGenderFilter,
  toSelectValue,
  toStatusFilter,
} from '@/presentation/components/character/character-filters.helper';

describe('filter options', () => {
  it('exposes lowercase API values with capitalized labels', () => {
    expect(STATUS_FILTER_OPTIONS).toEqual([
      { value: 'alive', label: 'Alive' },
      { value: 'dead', label: 'Dead' },
      { value: 'unknown', label: 'Unknown' },
    ]);
    expect(GENDER_FILTER_OPTIONS).toEqual([
      { value: 'female', label: 'Female' },
      { value: 'male', label: 'Male' },
      { value: 'genderless', label: 'Genderless' },
      { value: 'unknown', label: 'Unknown' },
    ]);
  });
});

describe('toStatusFilter', () => {
  it('maps a lowercase API value to the domain status', () => {
    expect(toStatusFilter('alive')).toBe(CharacterStatus.Alive);
    expect(toStatusFilter('unknown')).toBe(CharacterStatus.Unknown);
  });

  it('is case-insensitive so legacy capitalized URLs still resolve', () => {
    expect(toStatusFilter('Alive')).toBe(CharacterStatus.Alive);
  });

  it('returns undefined for an unrecognized value', () => {
    expect(toStatusFilter('nope')).toBeUndefined();
  });
});

describe('toGenderFilter', () => {
  it('maps a lowercase API value to the domain gender', () => {
    expect(toGenderFilter('genderless')).toBe(CharacterGender.Genderless);
    expect(toGenderFilter('female')).toBe(CharacterGender.Female);
  });

  it('is case-insensitive so legacy capitalized URLs still resolve', () => {
    expect(toGenderFilter('Genderless')).toBe(CharacterGender.Genderless);
  });

  it('returns undefined for an unrecognized value', () => {
    expect(toGenderFilter('nope')).toBeUndefined();
  });
});

describe('toFilterValue', () => {
  it('maps the "all" sentinel to an empty filter', () => {
    expect(toFilterValue(FILTER_ALL_VALUE)).toBe('');
  });

  it('passes through concrete values', () => {
    expect(toFilterValue('alive')).toBe('alive');
  });
});

describe('toSelectValue', () => {
  it('maps an empty filter to the "all" sentinel', () => {
    expect(toSelectValue('')).toBe(FILTER_ALL_VALUE);
  });

  it('passes through concrete values', () => {
    expect(toSelectValue('male')).toBe('male');
  });
});
