import { MapPin, Users } from 'lucide-react';

import type { Location } from '@/core/domain/entities/location.entity';
import { Badge } from '@/presentation/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { cn } from '@/shared/lib/utils';

// Type → badge tint. Light shades are 700 (not 600) so the text stays AA-legible
// on the /15 tinted backgrounds. Unknown/other types fall back to the Planet tint.
const PLANET_TYPE_BADGE_STYLE = 'bg-blue-500/15 text-blue-700 dark:text-blue-400';

const TYPE_BADGE_STYLES: Record<string, string> = {
  Planet: PLANET_TYPE_BADGE_STYLE,
  Cluster: 'bg-purple-500/15 text-purple-700 dark:text-purple-400',
  'Space Station': 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  Microverse: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-400',
  TV: 'bg-rose-500/15 text-rose-700 dark:text-rose-400',
  Dream: 'bg-pink-500/15 text-pink-700 dark:text-pink-400',
  'Unmapped Space': 'bg-slate-500/15 text-slate-700 dark:text-slate-400',
};

// The residents bar fills proportionally up to this many residents.
const RESIDENTS_BAR_MAX = 1000;
const FULL_BAR_PERCENT = 100;

interface LocationCardProps {
  location: Location;
}

export function LocationCard({ location }: LocationCardProps) {
  const residentCount = location.residentIds.length;
  const barPercent = Math.min(
    (residentCount / RESIDENTS_BAR_MAX) * FULL_BAR_PERCENT,
    FULL_BAR_PERCENT,
  );
  const typeStyle = TYPE_BADGE_STYLES[location.type] ?? PLANET_TYPE_BADGE_STYLE;

  return (
    <Card className="border-l-primary overflow-hidden border-l-4">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="line-clamp-2 text-lg" title={location.name}>
              {location.name}
            </CardTitle>
            <p className="text-muted-foreground mt-1 text-xs">{location.dimension}</p>
          </div>
          <Badge className={cn('shrink-0', typeStyle)}>{location.type}</Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-1.5">
              <Users className="text-muted-foreground size-4" aria-hidden="true" />
              <span className="text-muted-foreground text-xs font-medium">Residents</span>
            </div>
            <p className="text-foreground mt-1 text-2xl font-bold">
              {residentCount.toLocaleString()}
            </p>
          </div>

          <div className="bg-primary/10 rounded-lg p-3">
            <div className="flex items-center gap-1.5">
              <MapPin className="text-primary size-4" aria-hidden="true" />
              <span className="text-primary text-xs font-medium">Mapped</span>
            </div>
            <p className="text-primary mt-1 text-2xl font-bold">✓</p>
          </div>
        </div>

        <div className="bg-muted h-1 w-full overflow-hidden rounded-full">
          <div
            className="from-primary to-primary/60 h-full bg-gradient-to-r"
            style={{ width: `${barPercent}%` }}
            aria-hidden="true"
          />
        </div>
      </CardContent>
    </Card>
  );
}
