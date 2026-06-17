# ADR 001: Decisiones de arquitectura y stack

- **Estado:** Aceptada
- **Fecha:** 2026-06-17
- **Ámbito:** Setup inicial de Rick & Morty Wiki

---

## Contexto

Arrancamos un proyecto nuevo: una wiki de Rick & Morty (SPA) que consume la
[API pública de Rick and Morty](https://rickandmortyapi.com/). Es un proyecto
de challenge/aprendizaje cuyo objetivo no es solo "que funcione", sino servir de
referencia de buenas prácticas: separación de responsabilidades, testabilidad,
y un stack moderno y sostenible.

Necesitamos decidir, antes de escribir lógica de negocio:

1. El build tool / dev server.
2. Cómo gestionar el estado de servidor (datos remotos).
3. Cómo organizar el código a alto nivel.
4. De dónde sacar los componentes de UI.
5. Cómo manejar el estado que debe vivir en la URL (filtros, paginación, búsqueda).

Estas decisiones son costosas de revertir una vez que hay features encima, por
eso se documentan aquí.

---

## Decisión

### 1. Vite como build tool y dev server

Usamos **Vite** (con `@vitejs/plugin-react`) en lugar de un meta-framework
(Next.js) o de CRA.

- El producto es una SPA pura que consume una API REST externa; no necesitamos
  SSR/SSG ni un servidor de aplicación.
- El dev server de Vite arranca en milisegundos (esbuild + ESM nativo) y el HMR
  es prácticamente instantáneo, lo que importa en un proyecto de iteración rápida.
- El build de producción (Rollup) hace tree-shaking y code-splitting con cero
  configuración.
- CRA está deprecado y su ecosistema sin mantenimiento activo.

### 2. TanStack Query para el estado de servidor

Usamos **TanStack Query v5** para todo lo que venga de la API, en vez de
`useEffect` + `useState` o un store global (Redux/Zustand) para datos remotos.

- Separa explícitamente _server state_ (asíncrono, cacheable, compartido) de
  _client/UI state_. Son problemas distintos y se resuelven distinto.
- Resuelve de fábrica caché, deduplicación de requests, reintentos,
  invalidación, estados de `loading`/`error` y `staleTime`/`gcTime`.
- Encaja con Clean Architecture: los hooks de presentación envuelven los casos
  de uso/repositorios; Query solo gestiona el ciclo de vida del fetching.

### 3. Clean Architecture por capas

Organizamos `src/` en capas con una **regla de dependencias unidireccional**:
`presentation → application → core`, e `infrastructure → core` (implementa los
puertos). `shared` es transversal.

- `core/` — dominio puro (entidades, value objects, puertos de repositorio).
  Sin dependencias de framework.
- `application/` — casos de uso que orquestan el dominio contra los puertos.
- `infrastructure/` — adaptadores: cliente HTTP, repos concretos, API client,
  mappers, cliente de Query, mocks de MSW.
- `presentation/` — React: pages, layouts, componentes, hooks, routing.
- `shared/` — config, utils, tipos y constantes transversales.

El dominio no conoce React ni `fetch`; eso permite testear reglas de negocio sin
montar componentes y cambiar detalles de infraestructura (p. ej. la fuente de
datos) sin tocar el dominio.

### 4. shadcn/ui para la capa de UI

Usamos **shadcn/ui** sobre **Tailwind CSS v4** y Radix primitives, en vez de una
librería de componentes empaquetada (MUI, Chakra, Ant Design).

- No es una dependencia: el CLI copia el código de cada componente dentro del
  repo (`presentation/components/ui/`), así que tenemos control total y podemos
  versionarlo y adaptarlo.
- Accesibilidad seria de base (Radix) sin heredar un sistema de theming opaco.
- Tailwind v4 con config CSS-first (`@theme` en `index.css`) y el plugin nativo
  de Vite reduce el setup a casi cero.
- Evita el peso y el lock-in de runtime de las librerías empaquetadas.

### 5. nuqs para el estado en la URL

Usamos **nuqs** para el estado que debe ser compartible y persistente vía
querystring (filtros de personajes, paginación, búsqueda), en vez de manejar
`URLSearchParams` a mano.

- La URL es la fuente de verdad para ese estado: enlaces compartibles,
  back/forward del navegador y recarga conservan la vista.
- API tipo `useState` con tipado y parsers/serializers seguros, sin sincronizar
  manualmente estado de React con la querystring.
- Se integra con React Router v7 mediante su adapter (`NuqsAdapter`), que por
  depender del contexto del router se monta en el `RootLayout`, no en los
  providers globales.

---

## Consecuencias

### Positivas

- Límites claros entre capas → código testeable y con responsabilidades acotadas.
- Estado de servidor y de URL resueltos por herramientas especializadas, no
  reinventados con `useEffect`.
- UI con código propio (shadcn) y a11y de base; sin lock-in de runtime.
- DX rápida (Vite) y dominio independiente del framework.

### Negativas / costes

- Más carpetas y ceremonia (mappers, puertos, casos de uso) que un enfoque
  "todo en componentes"; sobre-ingeniería si el proyecto se mantuviera trivial.
- Curva de aprendizaje para quien no conozca Clean Architecture o el modelo de
  caché de TanStack Query.
- shadcn implica mantener el código de los componentes copiados (actualizaciones
  manuales vía CLI).
- nuqs añade un acoplamiento (vía adapter) a React Router.

---

## Alternativas consideradas

| Decisión           | Alternativa                       | Por qué se descartó                                                              |
| ------------------ | --------------------------------- | -------------------------------------------------------------------------------- |
| Build tool         | Next.js                           | SSR/SSG innecesario para una SPA que consume una API externa; añade complejidad. |
| Build tool         | Create React App                  | Deprecado y sin mantenimiento; DX y builds inferiores a Vite.                    |
| Estado de servidor | Redux Toolkit / Zustand           | Resuelven _client state_; obligarían a reimplementar caché, reintentos, etc.     |
| Estado de servidor | `useEffect` + `fetch`             | Propenso a errores (races, sin caché ni dedupe); no escala.                      |
| Arquitectura       | Estructura por features sin capas | Más simple al inicio, pero diluye la frontera dominio/infraestructura.           |
| UI                 | MUI / Chakra / Ant Design         | Peso de runtime, theming opaco y lock-in; menos control sobre el markup.         |
| UI                 | Tailwind "a secas" sin shadcn     | Reescribiríamos a mano accesibilidad y primitives que Radix ya resuelve.         |
| Estado en la URL   | `useSearchParams` manual          | Boilerplate de parseo/serialización y sincronización propensa a bugs.            |
| Estado en la URL   | Estado global (Zustand/Context)   | No es compartible por URL ni sobrevive a recarga; rompe back/forward.            |

---

## Decisiones relacionadas

- [ADR 002: Lazy route splitting](002-lazy-route-splitting.md) — code splitting por
  ruta con `React.lazy` + `Suspense` para reducir el bundle inicial.
