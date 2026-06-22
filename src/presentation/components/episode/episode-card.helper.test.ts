import { describe, expect, it } from 'vitest';

import { parseEpisodeSeason } from '@/presentation/components/episode/episode-card.helper';

describe('parseEpisodeSeason', () => {
  it('parses the season from a well-formed code', () => {
    expect(parseEpisodeSeason('S03E07')).toBe(3);
  });

  it('handles multi-digit seasons', () => {
    expect(parseEpisodeSeason('S12E20')).toBe(12);
  });

  it('falls back to season 1 for a malformed code', () => {
    expect(parseEpisodeSeason('not-a-code')).toBe(1);
  });
});
