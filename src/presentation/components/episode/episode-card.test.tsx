import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Episode } from '@/core/domain/entities/episode.entity';
import { EpisodeCard } from '@/presentation/components/episode/episode-card';

const EPISODE: Episode = {
  id: 1,
  name: 'Pilot',
  code: 'S01E01',
  airDate: 'December 2, 2013',
  characterIds: [1, 2],
};

describe('EpisodeCard', () => {
  it('shows the code, name, and air date', () => {
    render(<EpisodeCard episode={EPISODE} />);

    expect(screen.getByText('S01E01')).toBeInTheDocument();
    expect(screen.getByText('Pilot')).toBeInTheDocument();
    expect(screen.getByText('December 2, 2013')).toBeInTheDocument();
  });

  it('shows the season and featured character count', () => {
    render(<EpisodeCard episode={EPISODE} />);

    expect(screen.getByText('Season 1')).toBeInTheDocument();
    expect(screen.getByText('Featured Characters')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
