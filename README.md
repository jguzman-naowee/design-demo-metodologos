# design-demo-metodologos

Demo móvil navegable de la app de **Metodólogos** (Naowee). Parte del marco `design-layouts-demos`: teléfono con la app dentro, recorrido guiado por casos y modo dev.

## Estado

Vacío: falta mapear la app y montarla. Seguir `docs/MAPEO-METODOLOGOS.md`.

## Cómo está armado

- `mobile/apps/<id>/`: una carpeta por demo (`app.json`, `casos.js` y la app).
- `docs/MONTAR-DEMO-MOBILE.md`: cómo montar cualquier proyecto en el teléfono.
- `RULES.md`: reglas del marco.
- `npm run dev` → http://localhost:8770 (móvil con `?dev=1` para el modo dev).

## Contribuir

Es de libre uso (MIT, ver `LICENSE`) y se aceptan PR: rama `<tipo>/<kebab-case>`, commits gitmoji en español con el porqué en el cuerpo.
