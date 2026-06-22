import { Calendar, Tv } from 'lucide-react';

import type { Episode } from '@/core/domain/entities/episode.entity';
import { parseEpisodeSeason } from '@/presentation/components/episode/episode-card.helper';
import { Badge } from '@/presentation/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { cn } from '@/shared/lib/utils';

// Season → badge tint. Light shades are 700 (not 600) to stay AA-legible on the
// /15 tinted backgrounds. Seasons beyond the map fall back to the season-1 tint.
const SEASON_1_BADGE_STYLE = 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400';

const SEASON_BADGE_STYLES: Record<number, string> = {
  1: SEASON_1_BADGE_STYLE,
  2: 'bg-sky-500/15 text-sky-700 dark:text-sky-400',
  3: 'bg-violet-500/15 text-violet-700 dark:text-violet-400',
  4: 'bg-orange-500/15 text-orange-700 dark:text-orange-400',
  5: 'bg-red-500/15 text-red-700 dark:text-red-400',
  6: 'bg-pink-500/15 text-pink-700 dark:text-pink-400',
  7: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400',
};

const SEASON_BAR_SEGMENTS = 5;

interface EpisodeCardProps {
  episode: Episode;
}

export function EpisodeCard({ episode }: EpisodeCardProps) {
  const season = parseEpisodeSeason(episode.code);
  const characterCount = episode.characterIds.length;
  const seasonStyle = SEASON_BADGE_STYLES[season] ?? SEASON_1_BADGE_STYLE;

  return (
    <Card className="from-background via-background to-muted/30 overflow-hidden bg-gradient-to-br transition-all hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Badge className={cn('shrink-0 font-mono text-xs', seasonStyle)}>{episode.code}</Badge>
          <Badge variant="outline" className="shrink-0">
            <Tv className="mr-1 size-3" aria-hidden="true" />
            Season {season}
          </Badge>
        </div>
        <CardTitle className="mt-3 line-clamp-2 text-lg" title={episode.name}>
          {episode.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="text-muted-foreground size-4" aria-hidden="true" />
          <span className="text-muted-foreground text-sm">Air Date</span>
          <span className="text-foreground ml-auto text-sm font-medium">{episode.airDate}</span>
        </div>

        <div className="bg-muted/50 space-y-2 rounded-lg p-3">
          <div className="text-muted-foreground text-xs font-medium">Featured Characters</div>
          <div className="flex items-baseline gap-2">
            <span className="text-primary text-3xl font-bold">
              {characterCount.toLocaleString()}
            </span>
            <span className="text-muted-foreground text-sm">appearances</span>
          </div>
        </div>

        <div className="flex gap-1">
          {Array.from({ length: SEASON_BAR_SEGMENTS }, (_, index) => (
            <div
              key={index}
              className={cn(
                'h-2 flex-1 rounded-full transition-colors',
                index < Math.min(season, SEASON_BAR_SEGMENTS) ? 'bg-primary' : 'bg-muted',
              )}
              aria-hidden="true"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
