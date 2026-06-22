# Rick & Morty Wiki — AI context (Claude Code)

A Rick & Morty wiki SPA built with **React 19 + TypeScript** following **Clean
Architecture**. Data comes from the public [Rick and Morty API](https://rickandmortyapi.com/).
Live demo: https://rick-morty-wiki-react.vercel.app/

> Read this before writing code. It is the source of truth for architecture and
> conventions. See also [README.md](README.md) (features),
> [CONTRIBUTING.md](CONTRIBUTING.md), and the ADRs in
> [`docs/decisions/`](docs/decisions/).

## Stack

| Concern         | Choice                                                        |
| --------------- | ------------------------------------------------------------- |
| Build / dev     | Vite 8 + `@vitejs/plugin-react` (dev server on **port 3000**) |
| Language        | TypeScript 6 (strict, `tsc -b` project references)            |
| UI              | React 19 · shadcn/ui · Tailwind CSS 4 · Radix · lucide-react  |
| Server state    | TanStack Query 5                                              |
| Routing         | React Router 7 (lazy, code-split routes)                      |
| URL state       | nuqs 2 (filters & pagination live in the URL)                 |
| Forms           | react-hook-form + zod                                         |
| Unit/integ.     | Vitest 4 + Testing Library + jsdom · MSW 2 · vitest-axe       |
| E2E             | Playwright (Chromium) + `@axe-core/playwright`                |
| Package manager | **pnpm**                                                      |
| Deploy          | Vercel (SPA rewrites + security headers in `vercel.json`)     |

## Architecture — layers & the dependency rule

Source lives under `src/`, split into five layers. **Dependencies point inward
only.** Outer layers know about inner layers; inner layers never know about outer
ones. `shared/` is a dependency-free leaf usable by anyone.

```
presentation ──▶ application ──▶ core
      │                ▲           ▲
      └──▶ infrastructure ────────┘
                  (presentation reaches infrastructure ONLY at the hook composition root)
shared ◀── importable by every layer
```

### Who may import whom

| Layer              | Folder                | May import                                                                           | Must NOT import                           |
| ------------------ | --------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------- |
| **core**           | `src/core/`           | `shared` only                                                                        | application, infrastructure, presentation |
| **application**    | `src/application/`    | `core`, `shared`                                                                     | infrastructure, presentation              |
| **infrastructure** | `src/infrastructure/` | `core`, `application`, `shared`                                                      | presentation                              |
| **presentation**   | `src/presentation/`   | `application`, `core`, `shared`; `infrastructure` **only** in `presentation/hooks/*` | infrastructure anywhere else              |
| **shared**         | `src/shared/`         | (nothing internal)                                                                   | every other layer                         |

### What lives in each layer

- **`core/`** — the domain. Framework-free, zero outward dependencies.
  - `core/domain/entities/*.entity.ts` — domain entities + value-object enums
    (`CharacterStatus.Alive`, `CharacterGender.Female`, …).
  - `core/domain/repositories/*.repository.ts` — repository **ports**
    (interfaces) plus their query/result types (`CharacterRepository`,
    `CharacterPage`, `GetCharactersQuery`). No implementations.
  - `core/errors/domain.error.ts` — domain errors.
- **`application/`** — orchestration. Depends on `core` only.
  - `application/use-cases/*.use-case.ts` — use cases as **factory functions**:
    `createGetCharactersUseCase({ repository })` returns `{ execute }`. They
    normalize/sanitize input and delegate to a repository **port** (dependency
    inversion). They never touch HTTP or React.
  - `application/dto/*.dto.ts` — the API contract shapes (request/response DTOs)
    and response normalizers (e.g. `normalizeCharactersResponse`).
- **`infrastructure/`** — the outside world. Depends on `core` + `application`.
  - `infrastructure/api/rick-morty.client.ts` — typed API client; builds query
    strings, returns **raw DTOs** untouched.
  - `infrastructure/http/http-client.ts` — the only `fetch` in the app; throws
    `HttpError` on non-2xx.
  - `infrastructure/mappers/*.mapper.ts` — translate DTO → domain entity; narrow
    loose API strings to value objects, falling back to `Unknown` (never throw).
  - `infrastructure/repositories/*.repository.impl.ts` — concrete ports:
    `createCharacterRepository()`. Call client → map → return entity; treat a
    list-endpoint `404` as an empty page, not an error.
  - `infrastructure/mocks/` — MSW: `handlers.ts`, `browser.ts` (worker),
    `server.ts` (node/tests).
  - `infrastructure/query/query-client.ts` — the TanStack `QueryClient`
    (`staleTime` 5 min, `retry` 1, `refetchOnWindowFocus: false`).
- **`presentation/`** — React UI. Depends on `application` + `core`.
  - `presentation/hooks/use-*.hook.ts` — **the composition root.** Each hook wires
    `createXUseCase({ repository: createXRepository() })` (memoized) into
    `useQuery`. This is the ONLY place presentation imports `infrastructure`.
  - `presentation/components/` — feature components grouped by domain
    (`character/`, `episode/`, `location/`), shared components (`error-state`,
    `query-error-boundary`, `results-count`), and `ui/` (shadcn/Radix primitives).
  - `presentation/pages/*/*.page.tsx` — route-level pages.
  - `presentation/layouts/root-layout.tsx` — app shell (nav, skip link, focus
    management, nuqs adapter, `<Outlet />`).
  - `presentation/routes/` — `paths.ts` (`AppPath` enum) + `router.tsx`
    (`createBrowserRouter`, lazy routes).
  - `presentation/app/` — `App.tsx`, `providers.tsx` (`QueryClientProvider`).
- **`shared/`** — cross-cutting leaf: `config/env.ts`, `errors/http.error.ts`,
  `lib/utils.ts` (`cn()` = clsx + tailwind-merge).

### Request lifecycle (read once, internalize)

```
component → use-*.hook (useQuery) → use-case.execute() → repository port
          → repository.impl → rick-morty.client → http-client (fetch)
                                         ↓ raw DTO
                                      mapper → domain entity → back up the chain
```

The TanStack Query `signal` is threaded **end-to-end** (hook → use case →
repository → client → `fetch`) so in-flight requests cancel automatically. Keep
that thread intact in any new code.

## How to add a feature (the core → application → infrastructure → presentation flow)

Always build inward-out. Example: adding a new filter, endpoint, or entity.

1. **core** — model it. Add/extend the entity in `*.entity.ts`; add the method
   signature and its query/result types to the repository **port**
   (`*.repository.ts`). No implementation here.
2. **application** — add the use case
   (`createXUseCase({ repository }) → { execute }`) that normalizes input and
   calls the port. Add/extend the request & response DTOs in `application/dto/`.
3. **infrastructure** — add the client method in `rick-morty.client.ts` (hit the
   endpoint, return the raw DTO); add the `*.mapper.ts` DTO→entity translation;
   implement the new port method in `*.repository.impl.ts` (call client, map,
   handle `404`).
4. **presentation** — add the `use-*.hook.ts` that wires
   `createXUseCase({ repository: createXRepository() })` into `useQuery`; build
   the component/page; for a new route, register it in `router.tsx` and `paths.ts`.
5. **tests** — co-locate a `*.test.ts(x)` at each layer; add/extend the MSW
   handler in `infrastructure/mocks/handlers.ts`; add an `e2e/*.spec.ts` for a new
   user-facing flow.

### Worked example — adding a `Vehicles` resource

Build strictly inward-out. Each step lists the **exact files to create** and what
they export, mirroring the existing `Characters` feature. (`Vehicles` is
illustrative — the public API has no such endpoint.)

**1. `core` — model the domain (no implementations):**

| Order | File                                                 | Exports                                                                                               |
| ----- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 1     | `src/core/domain/entities/vehicle.entity.ts`         | `Vehicle` entity (+ any value-object enum, e.g. `VehicleKind`)                                        |
| 2     | `src/core/domain/repositories/vehicle.repository.ts` | port `VehicleRepository` + `VehicleFilters`, `VehiclePage`, `GetVehiclesQuery`, `GetVehicleByIdQuery` |

**2. `application` — orchestrate against the port:**

| Order | File                                                       | Exports                                                                                            |
| ----- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| 3     | `src/application/dto/vehicle.dto.ts`                       | `GetVehiclesRequestDto`, `VehicleApiDto`, `GetVehiclesResponseDto` (+ `normalizeVehiclesResponse`) |
| 4     | `src/application/use-cases/get-vehicles.use-case.ts`       | `createGetVehiclesUseCase({ repository }) → { execute }` (normalizes page/filters)                 |
| 5     | `src/application/use-cases/get-vehicle-detail.use-case.ts` | `createGetVehicleDetailUseCase({ repository })`                                                    |

**3. `infrastructure` — implement the port, talk to the API:**

| Order | File                                                         | Change                                                                            |
| ----- | ------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| 6     | `src/infrastructure/api/rick-morty.client.ts` _(edit)_       | add `fetchVehicles` / `fetchVehicleById` (build query string, return the raw DTO) |
| 7     | `src/infrastructure/mappers/vehicle.mapper.ts`               | `mapVehicle` (DTO→entity) + `mapVehiclePage`                                      |
| 8     | `src/infrastructure/repositories/vehicle.repository.impl.ts` | `createVehicleRepository()` (call client → map → return; list `404` → empty page) |
| 9     | `src/infrastructure/mocks/handlers.ts` _(edit)_              | add `/vehicle` MSW handlers                                                       |

**4. `presentation` — wire it to React (composition root = the hook):**

| Order | File                                                            | Exports / change                                                                                                                                                                    |
| ----- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 10    | `src/presentation/hooks/use-vehicles.hook.ts`                   | `useVehicles({ page, filters })` — wires `createGetVehiclesUseCase({ repository: createVehicleRepository() })` into `useQuery` (**only place presentation imports infrastructure**) |
| 11    | `src/presentation/hooks/use-vehicle-detail.hook.ts`             | `useVehicleDetail({ id })` (`throwOnError: true`)                                                                                                                                   |
| 12    | `src/presentation/components/vehicle/*`                         | `vehicle-card.tsx`, `vehicle-card-skeleton.tsx`, `vehicle-filters.tsx`, `vehicle-detail-view.tsx`, `vehicle-detail-skeleton.tsx`                                                    |
| 13    | `src/presentation/pages/vehicles/vehicles-list.page.tsx`        | `VehiclesListPage`                                                                                                                                                                  |
| 14    | `src/presentation/pages/vehicle-detail/vehicle-detail.page.tsx` | `VehicleDetailPage`                                                                                                                                                                 |
| 15    | `src/presentation/routes/paths.ts` _(edit)_                     | add `AppPath` entries + a `buildVehicleDetailPath` builder                                                                                                                          |
| 16    | `src/presentation/routes/router.tsx` _(edit)_                   | register the two `lazy(() => import(...))` routes                                                                                                                                   |

**5. tests** — co-locate a `*.test.ts(x)` beside every file above, extend the MSW
suite, and add `e2e/vehicles.spec.ts` for the list → detail flow.

## Conventions

### File & folder naming (kebab-case, role suffix)

| Role              | Pattern                             |
| ----------------- | ----------------------------------- |
| Domain entity     | `name.entity.ts`                    |
| Repository port   | `name.repository.ts`                |
| Repository impl   | `name.repository.impl.ts`           |
| Use case          | `name.use-case.ts`                  |
| DTO               | `name.dto.ts`                       |
| Mapper            | `name.mapper.ts`                    |
| API client        | `name.client.ts`                    |
| Presentation hook | `use-name.hook.ts`                  |
| Route page        | `name.page.tsx` / `name-page.tsx`   |
| Component         | `kebab-case.tsx`                    |
| Helper            | `name.helper.ts`                    |
| Error             | `name.error.ts`                     |
| Unit/integ. test  | `*.test.ts(x)` (co-located, Vitest) |
| E2E test          | `e2e/*.spec.ts` (Playwright)        |

### Types & identifiers

- **Interfaces / types:** `PascalCase`, **no `I` prefix** (`CharacterRepository`,
  not `ICharacterRepository`).
- **Enums:** `PascalCase` name + `PascalCase` members (`CharacterStatus.Alive`).
- **Functions:** `camelCase`. Factories are `createXUseCase` / `createXRepository`.
- **Constants:** `UPPER_SNAKE_CASE`, named by **meaning** not value
  (`FIRST_PAGE`, `STALE_TIME_MS`, `NOT_FOUND_STATUS` — never `FIVE`).
- **Imports:** the single alias is `@/` → `src/`. Always `@/...`, never relative
  (`../../core/...`).
- **Function params:** a function/hook/factory taking more than one argument takes
  a **single object** and destructures it (`mapCharacterPage({ dto, requestedPage })`,
  `httpClient.get({ path, signal })`). Exceptions: React event handlers, array
  callbacks, third-party callbacks.
- **Docs:** exported functions and interfaces carry JSDoc — match that density.
  Comments explain **why**, not what.
- **Language:** English only (code, names, comments).

### Testing

- Use Testing Library with **semantic queries** (`getByRole`, `getByText`).
- Mock the network with **MSW handlers**, not by stubbing `fetch`.
- Co-locate tests; Vitest only runs `src/**/*.{test,spec}.{ts,tsx}` — `e2e/` is
  Playwright's and is excluded.
- a11y is regression-tested: `vitest-axe` in jsdom, `@axe-core/playwright` in the
  real browser. Don't regress contrast/landmarks/labels.

## Commands (pnpm)

| Command              | What it does                       |
| -------------------- | ---------------------------------- |
| `pnpm dev`           | Vite dev server on port 3000       |
| `pnpm build`         | `tsc -b` type-check + `vite build` |
| `pnpm preview`       | Serve the production build locally |
| `pnpm test`          | Vitest (watch)                     |
| `pnpm test:run`      | Vitest once (no watch)             |
| `pnpm test:coverage` | Vitest + v8 coverage               |
| `pnpm test:ui`       | Vitest UI                          |
| `pnpm test:e2e`      | Playwright E2E (Chromium)          |
| `pnpm test:e2e:ui`   | Playwright UI mode                 |
| `pnpm lint`          | ESLint                             |
| `pnpm lint:fix`      | ESLint with `--fix`                |
| `pnpm format`        | Prettier check                     |
| `pnpm format:fix`    | Prettier write                     |
| `pnpm type:check`    | `tsc -b --noEmit`                  |

Environment variables are `VITE_`-prefixed and read **only** through
`shared/config/env.ts`. `VITE_ENABLE_MSW=true` turns on MSW in dev (the Playwright
E2E webServer uses it for deterministic runs). See `.env.example`.

## Architecture decisions quick reference

One line per recorded decision; full context in [`docs/decisions/`](docs/decisions/).
Read the relevant ADR before reversing a cross-cutting choice.

| Decision                        | Why                                                           | ADR                                                     |
| ------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------- |
| Vite (build + dev server)       | Pure SPA — no SSR; instant HMR; code-split build, zero config | [001](docs/decisions/001-architecture-decisions.md)     |
| TanStack Query for server state | Cache/dedupe/retries out of the box; server state ≠ UI state  | [001](docs/decisions/001-architecture-decisions.md)     |
| Clean Architecture in layers    | Clear boundaries; domain testable without React or `fetch`    | [001](docs/decisions/001-architecture-decisions.md)     |
| shadcn/ui + Tailwind 4 + Radix  | Own the component code; Radix a11y; no runtime lock-in        | [001](docs/decisions/001-architecture-decisions.md)     |
| nuqs for URL state              | Permalinkable filters; survives refresh and back/forward      | [001](docs/decisions/001-architecture-decisions.md)     |
| Lazy route splitting            | Smaller initial chunk; each route is its own on-demand chunk  | [002](docs/decisions/002-lazy-route-splitting.md)       |
| `HttpError` in `shared/`        | Removes the only `presentation → infrastructure` coupling     | [003](docs/decisions/003-http-error-in-shared-layer.md) |

## What NOT to do

- ❌ **Import `infrastructure/*` from `presentation`** (components, pages, layouts,
  routes). The composition root is `presentation/hooks/*` — the ONLY place that may
  import a repository impl or the API client. Everything else gets data through hooks.
- ❌ **Skip a layer.** Always go hook → use-case → repository **port** → impl →
  client. Don't call `rickMortyClient`/`httpClient` from a use case, and don't call
  a repository impl directly from a component.
- ❌ **Point dependencies outward.** `core` imports only `shared`; `application`
  never imports `infrastructure`; nothing imports `presentation`.
- ❌ **Define or import `HttpError` outside `shared/`.** It lives only in
  `@/shared/errors/http.error` (infra throws it, presentation reads `.status`).
  Don't move it into `infrastructure/` or re-export it — that reintroduces the
  cross-layer coupling [ADR 003](docs/decisions/003-http-error-in-shared-layer.md)
  removed.
- ❌ **Put business logic in React components** — data fetching, DTO→entity mapping,
  pagination math, filter normalization. That belongs in use cases, mappers, and
  repositories. Components render and wire hooks.
- ❌ **Use `useState` for state that belongs in the URL.** Filters, search, and
  pagination live in the URL via nuqs (`useQueryState`); `useState` would break
  shareable links, refresh, and back/forward. (Local `useState` is fine only for
  transient input — e.g. the search box text before it is debounced into the URL.)
- ❌ **Make a repository import another repository.** Each impl implements one port
  and talks only to the client + mappers. Expose cross-domain data on a port
  (e.g. `CharacterRepository.getEpisodesByIds`) instead of importing
  `episode.repository.impl` from `character.repository.impl`.
- ❌ **Hardcode API strings in components.** Resource paths (`/character`) and
  query-param keys live in `rick-morty.client.ts` and the DTOs. Components never
  build API URLs or know endpoint shapes — they call hooks.
- ❌ **Use relative imports** (`../../`) — use `@/...`. No `any`, no magic values,
  no positional multi-arg functions (pass a single destructured object).
- ❌ **Drop the abort `signal`** along the hook → fetch chain; **add a second
  `fetch` site** (the only one is `infrastructure/http/http-client.ts`); or **put
  Vitest tests in `e2e/`** / stub `fetch` instead of using MSW.
