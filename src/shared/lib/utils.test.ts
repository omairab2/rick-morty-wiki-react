import { describe, expect, it } from 'vitest';

import { cn } from '@/shared/lib/utils';

describe('cn', () => {
  it('merges class names and resolves Tailwind conflicts', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('ignores falsy values', () => {
    expect(cn('text-sm', false, undefined, 'font-bold')).toBe('text-sm font-bold');
  });
});
