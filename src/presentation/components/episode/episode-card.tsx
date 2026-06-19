import type { Episode } from '@/core/domain/entities/episode.entity';
import { Badge } from '@/presentation/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';

interface EpisodeCardProps {
  episode: Episode;
}

export function EpisodeCard({ episode }: EpisodeCardProps) {
  return (
    <Card>
      <CardHeader>
        <Badge variant="secondary" className="w-fit font-mono">
          {episode.code}
        </Badge>
        <CardTitle className="truncate" title={episode.name}>
          {episode.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">{episode.airDate}</CardContent>
    </Card>
  );
}
