import type { Character } from '@/core/domain/entities/character.entity';
import type { Episode } from '@/core/domain/entities/episode.entity';
import { CharacterCard } from '@/presentation/components/character/character-card';
import { Badge } from '@/presentation/components/ui/badge';
import { Separator } from '@/presentation/components/ui/separator';

const GRID_CLASSES = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4';

interface EpisodeDetailViewProps {
  episode: Episode;
  characters: Character[];
}

export function EpisodeDetailView({ episode, characters }: EpisodeDetailViewProps) {
  return (
    <article className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <Badge variant="secondary" className="w-fit font-mono">
          {episode.code}
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">{episode.name}</h1>
        <p className="text-muted-foreground text-sm">Aired {episode.airDate}</p>
      </header>

      <Separator />

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Characters ({characters.length})</h2>
        <div className={GRID_CLASSES}>
          {characters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      </section>
    </article>
  );
}
