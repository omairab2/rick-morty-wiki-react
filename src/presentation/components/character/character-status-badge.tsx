import { CharacterStatus } from '@/core/domain/entities/character.entity';
import { Badge } from '@/presentation/components/ui/badge';
import { cn } from '@/shared/lib/utils';

// Text shades are green/red-800 (not 700) so the badges clear WCAG AA (4.5:1)
// against their tinted backgrounds — 700 measured 4.32:1 in the axe audit.
const STATUS_STYLES: Record<CharacterStatus, string> = {
  [CharacterStatus.Alive]: 'border-transparent bg-green-500/15 text-green-800 dark:text-green-400',
  [CharacterStatus.Dead]: 'border-transparent bg-red-500/15 text-red-800 dark:text-red-400',
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
