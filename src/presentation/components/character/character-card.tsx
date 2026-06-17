import type { Character } from '@/core/domain/entities/character.entity';
import { CharacterStatusBadge } from '@/presentation/components/character/character-status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';

interface CharacterCardProps {
  character: Character;
}

export function CharacterCard({ character }: CharacterCardProps) {
  return (
    <Card className="overflow-hidden pt-0">
      <img
        src={character.imageUrl}
        alt={character.name}
        loading="lazy"
        className="aspect-square w-full object-cover"
      />
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
