# Copilot instructions — Rick & Morty Wiki

A React 19 + TypeScript SPA built with **Clean Architecture**, consuming the
public [Rick and Morty API](https://rickandmortyapi.com/). When generating or
completing code in this repo, follow these rules.

## Stack

React 19 · TypeScript 6 · Vite 8 (dev port 3000) · shadcn/ui · Tailwind CSS 4 ·
Radix · TanStack Query 5 (server state) · React Router 7 (lazy routes) · nuqs 2
(URL state) · react-hook-form + zod. Tests: Vitest 4 + Testing Library + MSW 2 +
vitest-axe; Playwright (Chromium) + `@axe-core/playwright` for E2E. **pnpm** is
the package manager. Deployed on Vercel.

## Layers & the dependency rule

Code lives under `src/` in five layers. **Dependencies point inward only.**

| Layer            | Folder                | May import                                                                       | Never import                              |
| ---------------- | --------------------- | -------------------------------------------------------------------------------- | ----------------------------------------- |
| `core`           | `src/core/`           | `shared` only                                                                    | application, infrastructure, presentation |
| `application`    | `src/application/`    | `core`, `shared`                                                                 | infrastructure, presentation              |
| `infrastructure` | `src/infrastructure/` | `core`, `application`, `shared`                                                  | presentation                              |
| `presentation`   | `src/presentation/`   | `application`, `core`, `shared`; `infrastructure` ONLY in `presentation/hooks/*` | infrastructure anywhere else              |
| `shared`         | `src/shared/`         | (nothing internal)                                                               | every other layer                         |

- **`core/`** — domain. `domain/entities/*.entity.ts` (entities + value-object
  enums), `domain/repositories/*.repository.ts` (repository **ports** =
  interfaces, no impls), `errors/`. Framework-free.
- **`application/`** — `use-cases/*.use-case.ts` are **factory functions**
  (`createXUseCase({ repository }) → { execute }`) that normalize input and call a
  repository port; `dto/*.dto.ts` are the API contract shapes. Imports `core` only.
- **`infrastructure/`** — `api/rick-morty.client.ts` (typed client, raw DTOs),
  `http/http-client.ts` (the only `fetch`, throws `HttpError`),
  `mappers/*.mapper.ts` (DTO→entity), `repositories/*.repository.impl.ts`
  (`createXRepository()`, 404 on a list = empty page), `mocks/` (MSW),
  `query/query-client.ts`.
- **`presentation/`** — `hooks/use-*.hook.ts` are the **composition root**: wire
  `createXUseCase({ repository: createXRepository() })` into `useQuery`. This is
  the only place presentation imports `infrastructure`. Plus `components/`
  (feature folders + `ui/` shadcn primitives), `pages/*/*.page.tsx`, `layouts/`,
  `routes/`, `app/`.
- **`shared/`** — `config/env.ts`, `errors/http.error.ts`, `lib/utils.ts` (`cn()`).

Request lifecycle: `component → use-*.hook → use-case.execute() → repository port
→ repository.impl → rick-morty.client → http-client (fetch) → mapper → entity`.
The TanStack Query `signal` is forwarded end-to-end — keep that thread intact.

## Adding a feature (always inward-out)

1. **core** — extend the entity + repository **port** (signature + types only).
2. **application** — add the use case factory + request/response DTO.
3. **infrastructure** — add the client method + mapper + implement the port method.
4. **presentation** — add the `use-*.hook.ts` (wires use case + repository into
   `useQuery`), build the component/page, register routes in `router.tsx` /
   `paths.ts`.
5. **tests** — co-located `*.test.ts(x)`, an MSW handler in
   `infrastructure/mocks/handlers.ts`, and an `e2e/*.spec.ts` for new flows.

**Example — a `Vehicles` resource, in exact creation order:**
`core/domain/entities/vehicle.entity.ts` → `core/domain/repositories/vehicle.repository.ts`
(port) → `application/dto/vehicle.dto.ts` → `application/use-cases/get-vehicles.use-case.ts`
(+ `get-vehicle-detail.use-case.ts`) → edit `infrastructure/api/rick-morty.client.ts`
(`fetchVehicles`/`fetchVehicleById`) → `infrastructure/mappers/vehicle.mapper.ts` →
`infrastructure/repositories/vehicle.repository.impl.ts` → edit
`infrastructure/mocks/handlers.ts` → `presentation/hooks/use-vehicles.hook.ts`
(+ `use-vehicle-detail.hook.ts`) → `presentation/components/vehicle/*` →
`presentation/pages/vehicles/vehicles-list.page.tsx` (+ `vehicle-detail/`) → edit
`presentation/routes/paths.ts` + `routes/router.tsx` → tests + `e2e/vehicles.spec.ts`.

## Conventions

- **Files:** kebab-case with role suffix — `*.entity.ts`, `*.repository.ts`,
  `*.repository.impl.ts`, `*.use-case.ts`, `*.dto.ts`, `*.mapper.ts`,
  `*.client.ts`, `use-*.hook.ts`, `*.page.tsx`, `*.helper.ts`, `*.error.ts`.
  Tests: `*.test.ts(x)` (Vitest, co-located); `e2e/*.spec.ts` (Playwright).
- **Types/interfaces:** `PascalCase`, **no `I` prefix** (`CharacterRepository`).
- **Enums:** `PascalCase.Member`. **Functions:** `camelCase`; factories
  `createX…`. **Constants:** `UPPER_SNAKE_CASE` named by meaning, never by value.
- **Imports:** only the `@/` → `src/` alias; never relative `../../`.
- **Params:** functions with >1 argument take a **single destructured object**.
- **No `any`**, no magic values. English only. Match the JSDoc density of exports.
- **Testing:** semantic queries (`getByRole`/`getByText`); mock with MSW, not by
  stubbing `fetch`; Vitest runs only `src/**/*.{test,spec}.{ts,tsx}`.

## Commands (pnpm)

`pnpm dev` (port 3000) · `pnpm build` · `pnpm preview` · `pnpm test` /
`test:run` / `test:coverage` / `test:ui` · `pnpm test:e2e` / `test:e2e:ui` ·
`pnpm lint` / `lint:fix` · `pnpm format` / `format:fix` · `pnpm type:check`.
Env vars are `VITE_`-prefixed, read only via `shared/config/env.ts`;
`VITE_ENABLE_MSW=true` enables MSW in dev.

## Architecture decisions

Recorded in [`docs/decisions/`](../docs/decisions/): **ADR 001** (stack — Vite,
TanStack Query, layered Clean Architecture, shadcn/ui, nuqs), **ADR 002** (lazy
route splitting), **ADR 003** (`HttpError` lives in `shared/`). Read the relevant
ADR before reversing a cross-cutting choice.

## Do NOT

- ❌ Import `infrastructure/*` from `presentation` (components, pages, layouts,
  routes) — the composition root is `presentation/hooks/*`, the only place that
  may import a repo impl / API client. Everything else uses hooks.
- ❌ Skip a layer (always hook → use-case → repository port → impl → client) or
  point a dependency outward.
- ❌ Define or import `HttpError` outside `shared/` — it lives only in
  `@/shared/errors/http.error` (infra throws it, presentation reads `.status`);
  don't move it into `infrastructure/` or re-export it.
- ❌ Put business logic (fetching, DTO→entity mapping, pagination/filter logic) in
  React components — use cases, mappers, and repositories own it.
- ❌ Use `useState` for state that belongs in the URL — filters/search/pagination
  go through nuqs (`useQueryState`); `useState` is only for transient input.
- ❌ Make a repository import another repository — expose cross-domain data on a
  port (e.g. `CharacterRepository.getEpisodesByIds`) instead.
- ❌ Hardcode API strings (resource paths, query-param keys) in components — they
  live in `rick-morty.client.ts` and the DTOs; components call hooks.
- ❌ Use relative imports, `any`, magic values, or positional multi-arg functions.
- ❌ Drop the abort `signal`, add a second `fetch` site, or put Vitest tests in
  `e2e/` / stub `fetch` instead of using MSW.
