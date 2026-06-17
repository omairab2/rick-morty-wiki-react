import { describe, expect, it } from 'vitest';

import {
  CharacterGender,
  CharacterStatus,
  isCharacterAlive,
} from '@/core/domain/entities/character.entity';

describe('CharacterStatus', () => {
  it('exposes the canonical status values', () => {
    expect(CharacterStatus).toEqual({ Alive: 'Alive', Dead: 'Dead', Unknown: 'unknown' });
  });
});

describe('CharacterGender', () => {
  it('exposes the canonical gender values', () => {
    expect(CharacterGender).toEqual({
      Female: 'Female',
      Male: 'Male',
      Genderless: 'Genderless',
      Unknown: 'unknown',
    });
  });
});

describe('isCharacterAlive', () => {
  it('returns true only when the status is Alive', () => {
    expect(isCharacterAlive({ status: CharacterStatus.Alive })).toBe(true);
  });

  it('returns false for dead or unknown characters', () => {
    expect(isCharacterAlive({ status: CharacterStatus.Dead })).toBe(false);
    expect(isCharacterAlive({ status: CharacterStatus.Unknown })).toBe(false);
  });
});
