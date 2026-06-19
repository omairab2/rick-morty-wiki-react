import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  CharacterGender,
  CharacterStatus,
  type Character,
} from '@/core/domain/entities/character.entity';
import type { Episode } from '@/core/domain/entities/episode.entity';
import { EpisodeDetailView } from '@/presentation/components/episode/episode-detail-view';

const EPISODE: Episode = {
  id: 1,
  name: 'Pilot',
  code: 'S01E01',
  airDate: 'December 2, 2013',
  characterIds: [1],
};

const CHARACTERS: Character[] = [
  {
    id: 1,
    name: 'Rick Sanchez',
    status: CharacterStatus.Alive,
    species: 'Human',
    type: '',
    gender: CharacterGender.Male,
    origin: { name: 'Earth (C-137)', url: '' },
    location: { name: 'Citadel of Ricks', url: '' },
    imageUrl: 'https://example.com/rick.png',
    episodeCount: 1,
    episodeIds: [1],
  },
];

describe('EpisodeDetailView', () => {
  it('shows the episode info and a grid of character cards', () => {
    render(<EpisodeDetailView episode={EPISODE} characters={CHARACTERS} />);

    expect(screen.getByRole('heading', { level: 1, name: 'Pilot' })).toBeInTheDocument();
    expect(screen.getByText('S01E01')).toBeInTheDocument();
    expect(screen.getByText('Aired December 2, 2013')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /characters \(1\)/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
  });
});
