import { CharacterStatus } from '@/core/domain/entities/character.entity';
import { Badge } from '@/presentation/components/ui/badge';
import { cn } from '@/shared/lib/utils';

const STATUS_STYLES: Record<CharacterStatus, string> = {
  [CharacterStatus.Alive]: 'border-transparent bg-green-500/15 text-green-700 dark:text-green-400',
  [CharacterStatus.Dead]: 'border-transparent bg-red-500/15 text-red-700 dark:text-red-400',
  [CharacterStatus.Unknown]: 'border-transparent bg-muted text-muted-foreground',
};

interface CharacterStatusBadgeProps {
  status: CharacterStatus;
}

export function CharacterStatusBadge({ status }: CharacterStatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn('capitalize', STATUS_STYLES[status])}>
      {status}
    </Badge>
  );
}
