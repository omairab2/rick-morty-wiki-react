import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { QueryErrorBoundary } from '@/presentation/components/query-error-boundary';

let shouldThrow = true;

function MaybeThrows() {
  if (shouldThrow) {
    throw new Error('boom');
  }

  return <p>recovered</p>;
}

describe('QueryErrorBoundary', () => {
  it('renders its children when there is no error', () => {
    render(
      <QueryErrorBoundary fallback={() => <p>fallback</p>}>
        <p>content</p>
      </QueryErrorBoundary>,
    );

    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('renders the fallback with the thrown error', () => {
    render(
      <QueryErrorBoundary fallback={({ error }) => <p>{(error as Error).message}</p>}>
        <MaybeThrows />
      </QueryErrorBoundary>,
    );

    expect(screen.getByText('boom')).toBeInTheDocument();
  });

  it('clears the error and calls onReset when reset is invoked', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    shouldThrow = true;

    render(
      <QueryErrorBoundary
        onReset={onReset}
        fallback={({ reset }) => (
          <button
            type="button"
            onClick={() => {
              shouldThrow = false;
              reset();
            }}
          >
            retry
          </button>
        )}
      >
        <MaybeThrows />
      </QueryErrorBoundary>,
    );

    await user.click(screen.getByRole('button', { name: 'retry' }));

    expect(onReset).toHaveBeenCalledTimes(1);
    expect(screen.getByText('recovered')).toBeInTheDocument();
  });
});
