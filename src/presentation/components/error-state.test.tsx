import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ErrorState } from '@/presentation/components/error-state';

describe('ErrorState', () => {
  it('renders a default message and a retry button', () => {
    render(<ErrorState onRetry={vi.fn()} />);

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('renders a custom message when provided', () => {
    render(<ErrorState onRetry={vi.fn()} message="Custom failure" />);

    expect(screen.getByText('Custom failure')).toBeInTheDocument();
  });

  it('calls onRetry when the button is clicked', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);

    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
