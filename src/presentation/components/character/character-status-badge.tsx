import { CharacterStatus } from '@/core/domain/entities/character.entity';
import { Badge } from '@/presentation/components/ui/badge';
import { cn } from '@/shared/lib/utils';

// Text shades are 800 (not 600/700) so the badges clear WCAG AA (4.5:1) against
// their tinted backgrounds — 700 measured 4.32:1 in the axe audit. The colored
// dot is a redundant, decorative cue: the status label is always shown beside it.
const STATUS_BADGE_STYLES: Record<CharacterStatus, string> = {
  [CharacterStatus.Alive]: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-400',
  [CharacterStatus.Dead]: 'bg-red-500/15 text-red-800 dark:text-red-400',
  [CharacterStatus.Unknown]: 'bg-muted text-muted-foreground',
};

const STATUS_DOT_STYLES: Record<CharacterStatus, string> = {
  [CharacterStatus.Alive]: 'bg-emerald-500',
  [CharacterStatus.Dead]: 'bg-red-500',
  [CharacterStatus.Unknown]: 'bg-muted-foreground',
};

interface CharacterStatusBadgeProps {
  status: CharacterStatus;
}

export function CharacterStatusBadge({ status }: CharacterStatusBadgeProps) {
  return (
    <Badge variant="secondary" className={cn('gap-1.5 capitalize', STATUS_BADGE_STYLES[status])}>
      <span className={cn('size-1.5 rounded-full', STATUS_DOT_STYLES[status])} aria-hidden="true" />
      {status}
    </Badge>
  );
}
