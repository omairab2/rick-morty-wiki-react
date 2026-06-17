# Rick & Morty Wiki

A Rick & Morty wiki SPA built with **React 19 + TypeScript** following **Clean
Architecture**. Data comes from the public [Rick and Morty API](https://rickandmortyapi.com/).

## Tech stack

| Concern      | Choice                                         |
| ------------ | ---------------------------------------------- |
| Build / dev  | Vite + `@vitejs/plugin-react`                  |
| UI           | shadcn/ui + Tailwind CSS v4 + Radix primitives |
| Server state | TanStack Query v5                              |
| Routing      | React Router v7                                |
| URL state    | nuqs                                           |
| Forms        | React Hook Form + Zod                          |
| Testing      | Vitest + Testing Library + MSW                 |
| Quality      | ESLint + Prettier + Husky + lint-staged        |

See [docs/decisions/001-architecture-decisions.md](docs/decisions/001-architecture-decisions.md)
for the rationale behind these choices.

## Getting started

```bash
pnpm install
cp .env.example .env   # adjust VITE_API_BASE_URL if needed
pnpm dev               # http://localhost:3000
```

## Architecture

`src/` is split into layers with a one-way dependency rule
(`presentation → application → core`, `infrastructure → core`):

```
src/
├─ core/            # Domain: entities, value objects, repository ports, errors
├─ application/     # Use cases and DTOs (orchestrate the domain)
├─ infrastructure/  # Adapters: http client, repositories, api, mappers, query, mocks
├─ presentation/    # React: app, routes, layouts, pages, components/ui, hooks
└─ shared/          # Cross-cutting: config, lib, constants, types
```

The domain (`core/`) depends on nothing framework-specific. Infrastructure
implements the ports defined in `core/`. The presentation layer talks to the
application layer through hooks.

## Scripts

| Script               | Description                              |
| -------------------- | ---------------------------------------- |
| `pnpm dev`           | Start the dev server (port 3000)         |
| `pnpm build`         | Type-check (`tsc -b`) + production build |
| `pnpm preview`       | Preview the production build             |
| `pnpm lint`          | Run ESLint                               |
| `pnpm lint:fix`      | Run ESLint with auto-fix                 |
| `pnpm format`        | Check formatting with Prettier           |
| `pnpm format:fix`    | Write formatting with Prettier           |
| `pnpm type:check`    | Type-check without emitting              |
| `pnpm test`          | Run Vitest in watch mode                 |
| `pnpm test:run`      | Run Vitest once                          |
| `pnpm test:coverage` | Run Vitest with coverage                 |
| `pnpm test:ui`       | Open the Vitest UI                       |

## Conventions

- **Path alias:** import from `@/...` (maps to `src/`).
- **UI components:** add shadcn components with `pnpm dlx shadcn@latest add <name>`
  — they land in `src/presentation/components/ui/`.
- **Mocks:** register MSW handlers in `src/infrastructure/mocks/handlers.ts`.
  Set `VITE_ENABLE_MSW=true` to enable mocking in development.
- **Git hooks:** `pre-commit` runs `lint-staged` (ESLint + Prettier on staged files).
