# design-demo-metodologos

Demo móvil navegable de la app de **Metodólogos** (Naowee). Parte del marco `design-layouts-demos`: teléfono con la app dentro, recorrido guiado por casos y modo dev.

## Estado

Demo de la app **Metodólogos** (COC) montada en `mobile/apps/metodologos/`, con 20 casos guiados: sesión y eventos (1.x), evento y filtros (2.x), deportista, historial y su descarga (3.x), formulario de evaluación (4.x), Mi perfil (5.x) y alertas automáticas de evaluación (6.x).

- **Correr:** `npm run dev` → http://localhost:8770/mobile/?app=metodologos (agrega `&dev=1` para el modo dev).
- **Versión web:** la misma app en escritorio, http://localhost:8770/mobile/apps/metodologos/web.html (o el botón «Versión web» del marco; `web/` redirige ahí). Ver «Capa web» abajo.
- **Qué cubre y qué no:** `docs/inventario.md`. Lo principal que queda fuera: escribir en los campos (el marco no teclea), así que el formulario llega hasta los errores de validación, y la pantalla de actualización obligatoria.

## Cómo está armado

- `mobile/apps/<id>/`: una carpeta por demo (`app.json`, `casos.js` y la app).
- `docs/MONTAR-DEMO-MOBILE.md`: cómo montar cualquier proyecto en el teléfono.
- `RULES.md`: reglas del marco.
- `npm run dev` → http://localhost:8770 (móvil con `?dev=1` para el modo dev).

## Capa web

`mobile/apps/metodologos/web.html` carga las **mismas** pantallas, datos y rutas de la app móvil (nada duplicado) y solo cambia la presentación:

- **Con componentes del SDK de Naowee** (`sdk-react-components` → clases de `sdk-frontend-foundations`, compiladas en `css/sdk-naowee.css`): `NwtSidebar` (menú lateral colapsable, con «Cerrar sesión») + `NwtBadge` (avisos sin leer) y `NwtModal` en lugar de las hojas inferiores. Los íconos son los SVG de la demo.
- `css/web.css` (solo desde 900 px; por debajo se ve como la app móvil): solo la colocación — barra superior e inferior fuera, contenido centrado, eventos y deportistas en dos columnas y el login en columna centrada. No redefine estilos del SDK.
- `js/web.js`: pinta el `NwtSidebar` (Eventos, Mi perfil, Notificaciones, Conoce más), lo sincroniza con la ruta, la sesión y la campana, y cambia `Ui.openSheet` por `NwtModal` en escritorio.
- Interruptor: «Versión web» en el marco móvil (campo `web` de `app.json`) y «Ver como móvil» en el menú lateral.
- Los casos guiados siguen siendo del marco móvil; la versión web no tiene recorrido propio.

## Contribuir

Es de libre uso (MIT, ver `LICENSE`) y se aceptan PR: rama `<tipo>/<kebab-case>`, commits gitmoji en español con el porqué en el cuerpo.
