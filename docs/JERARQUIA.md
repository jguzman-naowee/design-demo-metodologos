# Jerarquía visual · app Metodólogos

Sistema de énfasis de la demo (`mobile/apps/metodologos/`). Parte de la exploración validada en el canvas
(`jerarquia.css`, 8 artboards *J) y se aplica a toda la app sin cambiar layout ni textos.

## Niveles

| Nivel | Qué es | Cómo se ve | Dónde |
|---|---|---|---|
| **Primario** | la acción de la pantalla, lo pendiente | `btn.primary` (orange-700); superficie cálida `orange-50` sin borde | Iniciar formulario, Aplicar, Guardar; resumen «N deportes por calificar», prueba pendiente, aviso sin leer |
| **Secundario** | contenido para leer y actuar después | superficie tonal `gray-100` sin borde (o card blanca con `--sombra-reposo` sobre lienzo `gray-100`); botón `btn.cream` (orange-100 + orange-800) | tarjetas de evento, filas de deportista, `pf-card`, `mp-card`, Descargar historial, Cerrar sesión, «No, seguir editando» |
| **Terciario** | salir, limpiar, cancelar | `btn.tertiary`: gray-100, sin borde, texto negro | Limpiar (filtro), Cancelar (formulario) |
| **En reposo** | lo cerrado o bloqueado | blanco + contorno `gray-200` (inset), títulos `gray-800`, imagen desaturada | deportista calificado, evaluación con plazo vencido, prueba/equipo bloqueado, evento finalizado, aviso leído |

Regla: una sola acción primaria por vista. `cream-outlined` queda como alias de `cream` (su borde competía con la primaria).

## Tipografía y divisores

- Rótulo de página baja un escalón (20px, `--fs-subtitle`) cuando la pantalla es *de* alguien; el **nombre del sujeto manda** (24px, `--fs-sujeto`): perfil del deportista/deporte y Mi perfil.
- Títulos de sección dentro de cards y de listas: 16px. Etiquetas e intros: 13–14px `gray-700`. Rótulos en mayúscula del filtro: 13px con `--ls-rotulo`.
- Notificaciones: qué pasó (16px) > cuándo · dónde (13px gray-800) > evento (13px gray-700).
- Divisores estructurales (appbar, nav, pestañas, hojas, listas) a `gray-200`. En el filtro las secciones se separan por aire.
- Formulario: cada sección abre con banda `blue-jic-50`; lo bloqueado (precargado o solo lectura) es superficie gray-100 sin borde, lo editable conserva borde gray-600.

## Barras fijas (DC-012, DC-013, DC-015, DC-016)

Regla: **como mucho una barra fija por pantalla**, y todas usan la misma sombra.

- **Eventos**: un solo scroll (`.evs`). Solo la fila buscador + Estado queda fija sobre el lienzo gray-100 (`top:-16px`, `z-index:5`).
- **Detalle de evento**: un solo scroll (`.evd`). Solo las pestañas quedan fijas (`top:-16px` porque el sticky respeta el padding del scroll, `z-index:5`). Al cambiar de pestaña con la barra pegada, la lista nueva empieza arriba.
- **Perfil, formulario, notificaciones**: barra compacta `Ui.topbar()` + `Ui.seguirTitulo()` (`z-index:6`, alto `--topbar-h` 52px). Es el primer hijo del scroll con margen negativo: no ocupa alto, así el contenido no salta. Aparece (opacidad + 8px) cuando el h1 pasa por debajo; mientras está oculta es `inert`.
- **Sombra (DC-016)**: degradado `--sombra-pegada` en `::after` de `.fija` / `.topbar`. Se enciende solo con scroll y la barra en su tope (`Ui.fijar()` pone `.pegada`; la topbar al estar `.on`). `.a-sangre` la extiende a los bordes.
- Las listas debajo de una barra fija tienen alto mínimo para que la barra no se suelte al filtrar con pocos resultados.

## Appbar (DC-017)

«Metodólogos» junto al logo: 14px bold gray-800 (nivel secundario). El logo sigue siendo la única zona tocable (44px) y la etiqueta no empuja ni la campana ni el menú.

## Hero del detalle de evento

Imagen a sangre (240px) con velo navy (`rgba(blue-jic-900)`, alfa .78–.95 bajo el texto); sin imagen queda un degradado de marca.
El nombre es el nivel primario (24px blanco); el chip y la fecha · lugar (14px, blanco 90%) son secundarios. El botón volver
va en blanco sobre un círculo navy translúcido de 44px. Mapeo de imágenes: `HERO` en `js/screens/evento-detalle.js`
(e2, e4, e5 con el hero oficial de la plataforma COC; e1 y e3 con su portada). Las portadas de las tarjetas no cambian.

## Contraste (cuentas)

| Par | Ratio | Decisión |
|---|---|---|
| orange-700 / orange-100 | 3.93 | no pasa: texto sobre naranja va en orange-800 (5.23) |
| gray-700 / orange-50 · gray-100 | 5.06 · 5.14 | ok para etiquetas |
| gray-500 / blanco | 2.61 | bordes de control a gray-600 (3.42) |
| error-400 / blanco | 2.41 | mensajes de error y asterisco a error-700 (5.07) |
| blanco / error-600 | 4.09 | insignia de la campana a error-700 |
| blanco / foto clara + velo .78 navy | ≥ 6 | el texto del hero se lee sobre cualquier imagen |

## Tokens

Nuevos (`--fs-sujeto`, `--sombra-reposo`, `--sombra-pegada`, `--ls-rotulo`, `--topbar-h`) viven en un bloque `:root` al inicio de
`css/components.css` porque `tokens.css` lo estaba editando otra tarea; **moverlos a `tokens.css` al consolidar**.
