import { describe, expect, it } from 'vitest';

import { buildCharacterDetailPath, buildEpisodeDetailPath } from '@/presentation/routes/paths';

describe('buildCharacterDetailPath', () => {
  it('builds a plain path when no back url is provided', () => {
    expect(buildCharacterDetailPath({ id: 5 })).toBe('/characters/5');
  });

  it('encodes the back url as a query param', () => {
    expect(buildCharacterDetailPath({ id: 5, back: '/?name=rick&status=alive' })).toBe(
      '/characters/5?back=%2F%3Fname%3Drick%26status%3Dalive',
    );
  });
});

describe('buildEpisodeDetailPath', () => {
  it('builds a plain path when no back url is provided', () => {
    expect(buildEpisodeDetailPath({ id: 8 })).toBe('/episodes/8');
  });

  it('encodes the back url as a query param', () => {
    expect(buildEpisodeDetailPath({ id: 8, back: '/episodes?episode=S02' })).toBe(
      '/episodes/8?back=%2Fepisodes%3Fepisode%3DS02',
    );
  });
});
