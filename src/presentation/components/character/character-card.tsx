import { ImageOff } from 'lucide-react';
import { useState } from 'react';

import type { Character } from '@/core/domain/entities/character.entity';
import { CharacterStatusBadge } from '@/presentation/components/character/character-status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';

const IMAGE_CLASSES = 'h-48 w-full object-cover';

interface CharacterCardProps {
  character: Character;
}

export function CharacterCard({ character }: CharacterCardProps) {
  const [hasImageError, setHasImageError] = useState(false);

  return (
    <Card className="overflow-hidden pt-0">
      {hasImageError ? (
        <div
          role="img"
          aria-label={character.name}
          className="bg-muted text-muted-foreground flex h-48 w-full items-center justify-center"
        >
          <ImageOff className="size-10" aria-hidden />
        </div>
      ) : (
        <img
          src={character.imageUrl}
          alt={character.name}
          loading="lazy"
          className={IMAGE_CLASSES}
          onError={() => setHasImageError(true)}
        />
      )}
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="truncate">{character.name}</CardTitle>
          <CharacterStatusBadge status={character.status} />
        </div>
      </CardHeader>
      <CardContent className="text-muted-foreground flex flex-col gap-1 text-sm">
        <p>
          <span className="text-foreground font-medium">Species:</span> {character.species}
        </p>
        <p>
          <span className="text-foreground font-medium">Origin:</span> {character.origin.name}
        </p>
      </CardContent>
    </Card>
  );
}
