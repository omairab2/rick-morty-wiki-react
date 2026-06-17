import type { Character } from '@/core/domain/entities/character.entity';
import type { Episode } from '@/core/domain/entities/episode.entity';
import { CharacterStatusBadge } from '@/presentation/components/character/character-status-badge';
import { ScrollArea } from '@/presentation/components/ui/scroll-area';
import { Separator } from '@/presentation/components/ui/separator';

interface CharacterDetailViewProps {
  character: Character;
  episodes: Episode[];
}

export function CharacterDetailView({ character, episodes }: CharacterDetailViewProps) {
  return (
    <article className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-[320px_1fr]">
        <img
          src={character.imageUrl}
          alt={character.name}
          className="aspect-square w-full rounded-xl object-cover"
        />
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{character.name}</h1>
            <CharacterStatusBadge status={character.status} />
          </div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
            <dt className="text-muted-foreground">Species</dt>
            <dd>{character.species}</dd>
            <dt className="text-muted-foreground">Gender</dt>
            <dd className="capitalize">{character.gender}</dd>
            <dt className="text-muted-foreground">Origin</dt>
            <dd>{character.origin.name}</dd>
            <dt className="text-muted-foreground">Location</dt>
            <dd>{character.location.name}</dd>
          </dl>
        </div>
      </div>

      <Separator />

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Episodes ({episodes.length})</h2>
        <ScrollArea className="h-64 rounded-md border">
          <ul className="divide-border divide-y">
            {episodes.map((episode) => (
              <li key={episode.id} className="flex flex-col gap-0.5 px-4 py-2 text-sm">
                <span className="font-medium">
                  {episode.code} - {episode.name}
                </span>
                <span className="text-muted-foreground">{episode.airDate}</span>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </section>
    </article>
  );
}
