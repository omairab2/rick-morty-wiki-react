import { Component, type ReactNode } from 'react';

interface QueryErrorBoundaryProps {
  fallback: (args: { error: unknown; reset: () => void }) => ReactNode;
  onReset?: () => void;
  children: ReactNode;
}

interface QueryErrorBoundaryState {
  error: unknown;
}

/**
 * Minimal error boundary for TanStack Query's `throwOnError`. Errors thrown
 * during render are handed to `fallback`, which also receives a `reset` to clear
 * the boundary — pair it with `QueryErrorResetBoundary` so the query refetches
 * instead of immediately re-throwing the cached error.
 */
export class QueryErrorBoundary extends Component<
  QueryErrorBoundaryProps,
  QueryErrorBoundaryState
> {
  state: QueryErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: unknown): QueryErrorBoundaryState {
    return { error };
  }

  handleReset = (): void => {
    this.props.onReset?.();
    this.setState({ error: null });
  };

  render(): ReactNode {
    if (this.state.error !== null) {
      return this.props.fallback({ error: this.state.error, reset: this.handleReset });
    }

    return this.props.children;
  }
}
