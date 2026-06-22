import { ImageOff, MapPin } from 'lucide-react';
import { useState } from 'react';

import type { Character } from '@/core/domain/entities/character.entity';
import { CharacterStatusBadge } from '@/presentation/components/character/character-status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';

interface CharacterCardProps {
  character: Character;
}

export function CharacterCard({ character }: CharacterCardProps) {
  const [hasImageError, setHasImageError] = useState(false);

  return (
    <Card className="overflow-hidden pt-0">
      <div className="bg-muted aspect-square w-full">
        {hasImageError ? (
          <div
            role="img"
            aria-label={character.name}
            className="text-muted-foreground flex size-full items-center justify-center"
          >
            <ImageOff className="size-10" aria-hidden="true" />
          </div>
        ) : (
          <img
            src={character.imageUrl}
            alt={character.name}
            loading="lazy"
            className="size-full object-cover"
            onError={() => setHasImageError(true)}
          />
        )}
      </div>

      <CardHeader>
        <div className="flex min-w-0 items-center justify-between gap-2">
          <CardTitle className="min-w-0 truncate text-xl" title={character.name}>
            {character.name}
          </CardTitle>
          <CharacterStatusBadge status={character.status} />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="bg-foreground size-2 rounded-full" aria-hidden="true" />
          <span className="text-muted-foreground">Species</span>
          <span className="text-foreground ml-auto font-medium">{character.species}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="text-muted-foreground size-4" aria-hidden="true" />
          <span className="text-muted-foreground">Origin</span>
          <span className="text-foreground ml-auto min-w-0 truncate font-medium">
            {character.origin.name}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
