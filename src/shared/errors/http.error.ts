/**
 * Error thrown when an HTTP request resolves with a non-2xx status.
 *
 * Lives in the shared layer (not infrastructure) so any layer — including
 * presentation, which needs to distinguish a 404 from other failures — can
 * reference it without importing infrastructure.
 */
export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}
