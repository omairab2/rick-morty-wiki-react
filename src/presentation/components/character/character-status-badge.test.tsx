import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CharacterStatus } from '@/core/domain/entities/character.entity';
import { CharacterStatusBadge } from '@/presentation/components/character/character-status-badge';

describe('CharacterStatusBadge', () => {
  it('renders the status label', () => {
    render(<CharacterStatusBadge status={CharacterStatus.Alive} />);

    expect(screen.getByText('Alive')).toBeInTheDocument();
  });

  it('uses emerald styling for alive characters', () => {
    render(<CharacterStatusBadge status={CharacterStatus.Alive} />);

    expect(screen.getByText('Alive').className).toContain('emerald');
  });

  it('uses red styling for dead characters', () => {
    render(<CharacterStatusBadge status={CharacterStatus.Dead} />);

    expect(screen.getByText('Dead').className).toContain('red');
  });

  it('uses muted styling for unknown status', () => {
    render(<CharacterStatusBadge status={CharacterStatus.Unknown} />);

    expect(screen.getByText('unknown').className).toContain('muted');
  });
});
