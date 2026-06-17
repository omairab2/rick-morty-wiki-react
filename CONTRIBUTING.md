# Contributing

Thanks for contributing! This project follows **Clean Architecture** and a few
simple conventions. Please read this before opening a PR.

## Prerequisites

- Node ≥ 20 and pnpm
- `pnpm install` once after cloning

## Branch naming

Branch off `main` using a type prefix that matches the work:

| Prefix      | Use for                                        | Example                       |
| ----------- | ---------------------------------------------- | ----------------------------- |
| `feat/`     | A new feature                                  | `feat/episodes-list`          |
| `fix/`      | A bug fix                                      | `fix/pagination-off-by-one`   |
| `perf/`     | A performance improvement                      | `perf/memoize-character-card` |
| `refactor/` | A change that neither fixes a bug nor adds one | `refactor/extract-http-error` |
| `chore/`    | Tooling, deps, config — no production code     | `chore/bump-vite`             |
| `docs/`     | Documentation only                             | `docs/contributing-guide`     |
| `test/`     | Tests only                                     | `test/character-mapper-edges` |

## Commit messages — Conventional Commits

Format: `type(optional-scope): subject`

```
feat: characters list with search, filters and pagination
fix(detail): keep filters when navigating back
perf: lazy route splitting
refactor: move HttpError to the shared errors layer
docs: readme and contributing guide
test: cover empty episodeIds in the detail use case
chore: bump tailwind to 4.3
```

Rules:

- **Type** is one of `feat`, `fix`, `perf`, `refactor`, `docs`, `test`, `chore`,
  `build`, `ci`.
- Subject in **imperative mood**, lowercase, no trailing period.
- Keep each commit **one logical change**. Don't mix a refactor with docs — split
  them into separate commits (that's why, e.g., the `HttpError` move and the docs
  update are two commits).
- A Husky `pre-commit` hook runs `lint-staged` (ESLint + Prettier on staged
  files); fix what it reports before committing.

## Quality gates

Before pushing, make sure these pass:

```bash
pnpm type:check
pnpm lint
pnpm test:run
pnpm build
```

(`pnpm format:fix` will auto-format; the `pre-commit` hook also formats staged
files.)

## Project conventions

- **Path alias:** import from `@/...` (maps to `src/`); never use relative `../`
  imports across layers.
- **Respect the dependency rule:** `presentation → application → core`,
  `infrastructure → core` (implements ports). Inner layers never import outer
  ones. Cross-cutting code goes in `shared/`.
- **One test per file:** every `*.ts(x)` ships a `*.test.ts(x)` next to it. Tests
  use MSW (no real network) and Testing Library (query by role/text, not test ids).
- **UI components:** add shadcn components with
  `pnpm dlx shadcn@latest add <name> -c .` (run from the project root — the `-c .`
  is required because of `pnpm-workspace.yaml`). They land in
  `src/presentation/components/ui/`.
- **Significant decisions:** record an ADR in [`docs/decisions/`](docs/decisions/)
  (`NNN-title.md`, append-only).

## Adding a new feature (layer by layer)

Build outward from the domain. Verify (`pnpm type:check && pnpm lint && pnpm test:run`)
after each layer. Using **Episodes** as an example:

1. **core** — `core/domain/entities/episode.entity.ts` (entity + value types) and,
   if it needs data access, the repository **port** in
   `core/domain/repositories/`. No framework code here.
2. **application** — `application/use-cases/get-episodes.use-case.ts` (orchestration,
   input normalization, dependency-injected port) and any
   `application/dto/*.dto.ts` (raw API contracts + normalization helpers).
3. **infrastructure** — extend `api/rick-morty.client.ts`, add a
   `mappers/*.mapper.ts` (API DTO → domain entity), implement the port in
   `repositories/`, and add MSW handlers in `mocks/handlers.ts` (cover success
   **and** error paths).
4. **presentation** — a `hooks/use-*.hook.ts` wrapping the use case with TanStack
   Query, presentational components in `components/`, a page in `pages/`, and a
   **lazy** route in `routes/router.tsx`. Keep state that belongs in the URL in
   `nuqs`.

Each step is independently testable, so the feature stays green throughout.

## Pull requests

- Keep PRs focused; one feature or fix per PR.
- Ensure the quality gates pass and new code is tested.
- Link the relevant ADR(s) if the PR introduces an architectural decision.
