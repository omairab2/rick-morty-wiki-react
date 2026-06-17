import { describe, expect, it } from 'vitest';

import type { CharacterApiDto, GetCharactersResponseDto } from '@/application/dto/character.dto';
import { CharacterGender, CharacterStatus } from '@/core/domain/entities/character.entity';
import { mapCharacter, mapCharacterPage } from '@/infrastructure/mappers/character.mapper';

function buildApiCharacter(overrides: Partial<CharacterApiDto> = {}): CharacterApiDto {
  return {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'Earth (C-137)', url: 'https://rickandmortyapi.com/api/location/1' },
    location: { name: 'Citadel of Ricks', url: 'https://rickandmortyapi.com/api/location/3' },
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    episode: [
      'https://rickandmortyapi.com/api/episode/1',
      'https://rickandmortyapi.com/api/episode/2',
    ],
    url: 'https://rickandmortyapi.com/api/character/1',
    created: '2017-11-04T18:48:46.250Z',
    ...overrides,
  };
}

describe('mapCharacter', () => {
  it('maps every field and derives episodeCount from the episode list', () => {
    expect(mapCharacter(buildApiCharacter())).toEqual({
      id: 1,
      name: 'Rick Sanchez',
      status: CharacterStatus.Alive,
      species: 'Human',
      type: '',
      gender: CharacterGender.Male,
      origin: { name: 'Earth (C-137)', url: 'https://rickandmortyapi.com/api/location/1' },
      location: { name: 'Citadel of Ricks', url: 'https://rickandmortyapi.com/api/location/3' },
      imageUrl: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
      episodeCount: 2,
    });
  });

  it('maps the API "unknown" value to the domain Unknown value object', () => {
    const character = mapCharacter(buildApiCharacter({ status: 'unknown', gender: 'unknown' }));

    expect(character.status).toBe(CharacterStatus.Unknown);
    expect(character.gender).toBe(CharacterGender.Unknown);
  });

  it('falls back to Unknown for unrecognized status/gender without throwing', () => {
    const character = mapCharacter(buildApiCharacter({ status: 'Cronenberged', gender: 'Robot' }));

    expect(character.status).toBe(CharacterStatus.Unknown);
    expect(character.gender).toBe(CharacterGender.Unknown);
  });
});

describe('mapCharacterPage', () => {
  it('derives pagination flags from the API next/prev links', () => {
    const dto: GetCharactersResponseDto = {
      info: {
        count: 826,
        pages: 42,
        next: 'https://rickandmortyapi.com/api/character?page=3',
        prev: 'https://rickandmortyapi.com/api/character?page=1',
      },
      results: [buildApiCharacter(), buildApiCharacter({ id: 2, name: 'Morty Smith' })],
    };

    expect(mapCharacterPage({ dto, requestedPage: 2 })).toMatchObject({
      page: 2,
      totalPages: 42,
      totalCount: 826,
      hasNextPage: true,
      hasPreviousPage: true,
    });
  });

  it('reports no next/previous page when the API links are null', () => {
    const dto: GetCharactersResponseDto = {
      info: { count: 0, pages: 0, next: null, prev: null },
      results: [],
    };

    const page = mapCharacterPage({ dto, requestedPage: 1 });

    expect(page.hasNextPage).toBe(false);
    expect(page.hasPreviousPage).toBe(false);
    expect(page.characters).toEqual([]);
  });
});
