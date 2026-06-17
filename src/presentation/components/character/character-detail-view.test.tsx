import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  CharacterGender,
  CharacterStatus,
  type Character,
} from '@/core/domain/entities/character.entity';
import type { Episode } from '@/core/domain/entities/episode.entity';
import { CharacterDetailView } from '@/presentation/components/character/character-detail-view';

const CHARACTER: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: CharacterStatus.Alive,
  species: 'Human',
  type: '',
  gender: CharacterGender.Male,
  origin: { name: 'Earth (C-137)', url: '' },
  location: { name: 'Citadel of Ricks', url: '' },
  imageUrl: 'https://example.com/rick.png',
  episodeCount: 2,
  episodeIds: [1, 2],
};

const EPISODES: Episode[] = [
  { id: 1, name: 'Pilot', code: 'S01E01', airDate: 'December 2, 2013' },
  { id: 2, name: 'Lawnmower Dog', code: 'S01E02', airDate: 'December 9, 2013' },
];

describe('CharacterDetailView', () => {
  it('renders the character info and the episode list', () => {
    render(<CharacterDetailView character={CHARACTER} episodes={EPISODES} />);

    expect(screen.getByRole('heading', { level: 1, name: 'Rick Sanchez' })).toBeInTheDocument();
    expect(screen.getByText('Human')).toBeInTheDocument();
    expect(screen.getByText('Earth (C-137)')).toBeInTheDocument();
    expect(screen.getByText('Citadel of Ricks')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Rick Sanchez' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /episodes \(2\)/i })).toBeInTheDocument();
    expect(screen.getByText('S01E01 - Pilot')).toBeInTheDocument();
    expect(screen.getByText('S01E02 - Lawnmower Dog')).toBeInTheDocument();
  });
});
