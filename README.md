# design-demo-metodologos

Demo móvil navegable de la app de **Metodólogos** (Naowee). Parte del marco `design-layouts-demos`: teléfono con la app dentro, recorrido guiado por casos y modo dev.

## Estado

Demo de la app **Metodólogos** (COC) montada en `mobile/apps/metodologos/`, con 13 casos guiados: sesión y eventos (1.x), evento y filtros (2.x), deportista (3.x), formulario de evaluación (4.x) y Mi perfil (5.x).

- **Correr:** `npm run dev` → http://localhost:8770/mobile/?app=metodologos (agrega `&dev=1` para el modo dev).
- **Qué cubre y qué no:** `docs/inventario.md`. Lo principal que queda fuera: escribir en los campos (el marco no teclea), así que el formulario llega hasta los errores de validación, y la pantalla de actualización obligatoria.

## Cómo está armado

- `mobile/apps/<id>/`: una carpeta por demo (`app.json`, `casos.js` y la app).
- `docs/MONTAR-DEMO-MOBILE.md`: cómo montar cualquier proyecto en el teléfono.
- `RULES.md`: reglas del marco.
- `npm run dev` → http://localhost:8770 (móvil con `?dev=1` para el modo dev).

## Contribuir

Es de libre uso (MIT, ver `LICENSE`) y se aceptan PR: rama `<tipo>/<kebab-case>`, commits gitmoji en español con el porqué en el cuerpo.
