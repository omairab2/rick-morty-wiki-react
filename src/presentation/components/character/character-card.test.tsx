import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  CharacterGender,
  CharacterStatus,
  type Character,
} from '@/core/domain/entities/character.entity';
import { CharacterCard } from '@/presentation/components/character/character-card';

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
  episodeCount: 3,
  episodeIds: [1, 2, 3],
};

describe('CharacterCard', () => {
  it('shows the name, species, origin, and status', () => {
    render(<CharacterCard character={CHARACTER} />);

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Human')).toBeInTheDocument();
    expect(screen.getByText('Earth (C-137)')).toBeInTheDocument();
    expect(screen.getByText('Alive')).toBeInTheDocument();
    expect(screen.getByText('Species:')).toBeInTheDocument();
    expect(screen.getByText('Origin:')).toBeInTheDocument();
  });

  it('renders the character image using the name as alt text', () => {
    render(<CharacterCard character={CHARACTER} />);

    expect(screen.getByRole('img', { name: 'Rick Sanchez' })).toHaveAttribute(
      'src',
      CHARACTER.imageUrl,
    );
  });

  it('falls back to a placeholder when the image fails to load', () => {
    render(<CharacterCard character={CHARACTER} />);

    fireEvent.error(screen.getByRole('img', { name: 'Rick Sanchez' }));

    expect(document.querySelector('img')).toBeNull();
    expect(screen.getByRole('img', { name: 'Rick Sanchez' })).toBeInTheDocument();
  });
});
