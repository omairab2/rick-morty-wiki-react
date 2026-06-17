import { describe, expect, it } from 'vitest';

import {
  FILTER_ALL_VALUE,
  toFilterValue,
  toSelectValue,
} from '@/presentation/components/character/character-filters.helper';

describe('toFilterValue', () => {
  it('maps the "all" sentinel to an empty filter', () => {
    expect(toFilterValue(FILTER_ALL_VALUE)).toBe('');
  });

  it('passes through concrete values', () => {
    expect(toFilterValue('Alive')).toBe('Alive');
  });
});

describe('toSelectValue', () => {
  it('maps an empty filter to the "all" sentinel', () => {
    expect(toSelectValue('')).toBe(FILTER_ALL_VALUE);
  });

  it('passes through concrete values', () => {
    expect(toSelectValue('Male')).toBe('Male');
  });
});
