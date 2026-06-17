# ADR 002: Lazy route splitting

- **Estado:** Aceptada
- **Fecha:** 2026-06-17
- **Ámbito:** Performance del bundle / estrategia de carga

---

## Contexto

Tras implementar la feature de Characters, el build de producción emitía un
único chunk de JS de ~508 kB (160 kB gzip) y Vite advertía que superaba el
límite de 500 kB. Todo el árbol de la app —incluyendo dependencias pesadas que
solo usa la lista de personajes (Radix UI vía shadcn, los íconos de Lucide)— se
descargaba en la carga inicial, aunque el usuario aún no hubiera navegado a esa
vista.

Como SPA con varias rutas (lista, detalle, y a futuro Episodes/Locations), no
hay razón para enviar el código de todas las páginas por adelantado.

## Decisión

Aplicamos **code splitting a nivel de ruta** con `React.lazy` + `Suspense`:

- En [`router.tsx`](../../src/presentation/routes/router.tsx) cada página se
  importa con `lazy(() => import(...))`, de modo que Rollup la separa en su
  propio chunk cargado bajo demanda al visitar la ruta.
- Como las páginas usan _named exports_, el `import()` se mapea a `default`
  (`.then((m) => ({ default: m.HomePage }))`).
- Un único `<Suspense>` envuelve el `<Outlet />` en
  [`root-layout.tsx`](../../src/presentation/layouts/root-layout.tsx) y muestra
  un fallback accesible (`role="status"`) mientras llega el chunk de la ruta.

Se eligió `React.lazy` + `Suspense` (en lugar de la API `route.lazy` del data
router de React Router) por ser el mecanismo estándar de React, agnóstico del
router y fácil de razonar.

## Consecuencias

### Positivas

- El chunk inicial deja de incluir el código y las dependencias de páginas no
  visitadas; desaparece el warning de tamaño de Vite.
- Cada ruta nueva (detalle, Episodes, Locations) se añade como chunk propio sin
  esfuerzo extra.
- La descarga inicial es menor → first load más rápido.

### Negativas / costes

- Al navegar a una ruta por primera vez hay un breve estado de carga del chunk
  (mitigado por el fallback de `Suspense` y la caché del navegador en visitas
  siguientes).
- Una mala granularidad (demasiados chunks pequeños) podría aumentar el número
  de requests; por ahora la división por página es el balance adecuado.

## Alternativas consideradas

| Alternativa                            | Por qué se descartó                                                                   |
| -------------------------------------- | ------------------------------------------------------------------------------------- |
| No dividir (un solo bundle)            | Mantiene el warning y penaliza el first load con código que el usuario quizá no use.  |
| `route.lazy` del data router           | Válido, pero atado a la API de React Router; `React.lazy` es más portable y estándar. |
| `manualChunks` (split solo de vendors) | Reduce el chunk principal pero no evita cargar el código de todas las páginas.        |
| Prefetch manual de todos los chunks    | Reintroduce el problema que queremos resolver (descargar todo por adelantado).        |
