/**
 * Error thrown when an HTTP request resolves with a non-2xx status.
 *
 * Why it lives in `shared/` and not `infrastructure/`: presentation needs to
 * distinguish a 404 (not-found) from other failures (`error.status`), and if
 * this class lived in infrastructure that check would force the project's only
 * `presentation → infrastructure` import. Keeping it in the shared leaf lets
 * both the HTTP client (which throws it) and presentation (which reads it)
 * depend on `shared`, not on each other.
 *
 * @see docs/decisions/003-http-error-in-shared-layer.md
 */
export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}
