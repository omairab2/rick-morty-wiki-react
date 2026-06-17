# ADR 003: HttpError en la capa shared

- **Estado:** Aceptada
- **Fecha:** 2026-06-17
- **Ámbito:** Límites de capas / manejo de errores

---

## Contexto

La página de detalle de personaje necesita distinguir un **404** ("personaje no
encontrado") de cualquier otro fallo (red, 500), para mostrar `NotFoundState` vs
`ErrorState`. Esa distinción se hace con `error instanceof HttpError && error.status === 404`.

`HttpError` vivía en `infrastructure/http/http-client.ts`. Como la presentación
necesitaba importarlo, se creaba la **única dependencia `presentation → infrastructure`**
de todo el proyecto, rompiendo la regla de capas (la presentación solo debería
depender de `application`, `core` y `shared`).

## Decisión

Movemos `HttpError` a **`src/shared/errors/http.error.ts`**.

- `shared` es transversal: cualquier capa puede importarlo sin violar la regla
  de dependencias.
- El cliente HTTP (`infrastructure`) sigue lanzándolo; la presentación lo importa
  para el chequeo de tipo. Ambos dependen ahora de `shared`, no entre sí.
- Convención de nombres consistente con `core/errors/domain.error.ts`
  (`*.error.ts`).

## Consecuencias

### Positivas

- **Regla de dependencias 100% limpia**: no queda ningún import de `presentation`
  hacia `infrastructure`.
- `HttpError` queda disponible para cualquier capa (p. ej. un futuro mapeo de
  errores en `application`).
- Una única fuente de verdad para el error de transporte HTTP.

### Negativas / costes

- Refactor de imports en los consumidores (cliente HTTP, página de detalle y dos
  tests). Bajo riesgo, cubierto por la suite de tests.

## Alternativas consideradas

| Alternativa                                            | Por qué se descartó                                                                              |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| Dejar `HttpError` en `infrastructure`                  | Mantiene el acoplamiento `presentation → infrastructure`.                                        |
| Traducir el 404 a un error de dominio en `application` | Más "puro", pero añade una capa de traducción para un solo caso; el ADR 002-style "as-is" basta. |
| Re-exportar `HttpError` desde varios sitios            | Múltiples fuentes de verdad; confunde de dónde importar.                                         |
