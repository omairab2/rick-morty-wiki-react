import { describe, expect, it } from 'vitest';

import {
  FILTER_ALL_VALUE,
  SEASON_OPTIONS,
  toFilterValue,
  toSelectValue,
} from '@/presentation/components/episode/episode-filters.helper';

describe('SEASON_OPTIONS', () => {
  it('lists seasons S01 through S08', () => {
    expect(SEASON_OPTIONS).toEqual(['S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08']);
  });
});

describe('toFilterValue', () => {
  it('maps the "all" sentinel to an empty filter', () => {
    expect(toFilterValue(FILTER_ALL_VALUE)).toBe('');
  });

  it('passes through concrete values', () => {
    expect(toFilterValue('S02')).toBe('S02');
  });
});

describe('toSelectValue', () => {
  it('maps an empty filter to the "all" sentinel', () => {
    expect(toSelectValue('')).toBe(FILTER_ALL_VALUE);
  });

  it('passes through concrete values', () => {
    expect(toSelectValue('S02')).toBe('S02');
  });
});
