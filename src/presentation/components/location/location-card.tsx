import type { Location } from '@/core/domain/entities/location.entity';
import { Badge } from '@/presentation/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';

interface LocationCardProps {
  location: Location;
}

export function LocationCard({ location }: LocationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="truncate" title={location.name}>
          {location.name}
        </CardTitle>
        <Badge variant="secondary" className="w-fit">
          {location.type}
        </Badge>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">{location.dimension}</CardContent>
    </Card>
  );
}
