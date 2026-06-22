import type { Character } from '@/core/domain/entities/character.entity';
import type { Location } from '@/core/domain/entities/location.entity';
import { CharacterCard } from '@/presentation/components/character/character-card';
import { Badge } from '@/presentation/components/ui/badge';
import { Separator } from '@/presentation/components/ui/separator';

const GRID_CLASSES = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4';

interface LocationDetailViewProps {
  location: Location;
  residents: Character[];
}

export function LocationDetailView({ location, residents }: LocationDetailViewProps) {
  return (
    <article className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <Badge variant="secondary" className="w-fit">
          {location.type}
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">{location.name}</h1>
        <p className="text-muted-foreground text-sm">{location.dimension}</p>
      </header>

      <Separator />

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Residents ({residents.length})</h2>
        <div className={GRID_CLASSES}>
          {residents.map((resident) => (
            <CharacterCard key={resident.id} character={resident} />
          ))}
        </div>
      </section>
    </article>
  );
}
