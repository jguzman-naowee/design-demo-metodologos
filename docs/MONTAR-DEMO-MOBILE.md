# Montar cualquier proyecto en el teléfono

Una demo es una carpeta `mobile/apps/<id>/` con tres cosas: la app (estática), `app.json` y `casos.js`.
El marco la muestra dentro de un teléfono y la recorre. La app no sabe que la guían (regla 1 de `RULES.md`).

## Resumen en 4 pasos

1. `npm run dev` → http://localhost:8770
2. `npm run nueva-app -- <id> --desde <carpeta-del-build> --nombre "Texto"` (o sin `--desde` para una app vacía).
3. Ajustar la app para que corra en un iframe del mismo origen (sección 2).
4. Escribir los casos con el modo dev (secciones 3 y 4): `http://localhost:8770/mobile/?app=<id>&dev=1`.

El script registra la app solo (`mobile/apps/index.js` se genera; no se edita).

## 1. Qué le pides al proyecto

Cualquier proyecto sirve si produce **HTML estático** que se vea bien a 375–412 px de ancho. El marco no lo adapta.

| Tipo de proyecto | Cómo obtener la carpeta que va en `--desde` |
|---|---|
| HTML/CSS/JS suelto | La carpeta tal cual (debe tener `index.html`). |
| Vite / React / Vue | `vite build --base=./` → `dist/`. |
| Angular | `ng build --base-href ./` → `dist/<app>/browser`. |
| Next.js | `output: "export"` en `next.config` → `out/`. |
| Micro-frontend federado (Naowee) | No corre solo: usa su arnés (`bootstrap.tsx`/`DemoHarness`) construido como app normal, no el remote. |
| Diseño en Figma / Pencil | Exporta primero a HTML; el marco no lee diseños. |

## 2. Ajustes para que corra dentro del marco

El marco la sirve desde `/mobile/apps/<id>/` **en el mismo origen**; sin eso no puede pulsar ni resaltar nada.

| Problema | Arreglo |
|---|---|
| Pantalla en blanco o 404 de `/assets/…` | Base relativa en el build (ver tabla anterior); nada de rutas que empiecen con `/`. |
| Rutas que se rompen al recargar | **Hash routing** (`/#/detalle`), no history API. |
| Llamadas a una API | Cambiarlas por datos fijos (`mock.js` o `fetch` interceptado). La demo no consulta servicios. |
| Service worker o PWA | Quitar el registro: cachea versiones viejas y confunde el recorrido. |
| Estado en `localStorage` o cookies | Limpiarlo al arrancar; cada caso debe partir del mismo estado. |
| Sin `<meta viewport>` | Agregarlo; si no, el teléfono muestra la versión de escritorio. |
| `window.open` o `target="_blank"` | Navegar en el mismo marco. |
| Login | Entrar con una sesión simulada; la demo no pide credenciales. |

### Quitar la pantalla de inicio propia (recomendado)

La entrada del repo ya hace de portada: el usuario eligió **Demo móvil**. Si la app trae su propia pantalla
previa (splash, portada, onboarding, selector de plataforma o de dispositivo), **quítala para esta superficie**:

- Haz que el build de la demo arranque directo en la primera pantalla útil.
- Apunta `inicio` de `app.json` a esa pantalla (por defecto `index.html`).
- Si la app decide la pantalla por una bandera (`?surface=mobile`, `localStorage`, ancho de pantalla), fíjala en el build de la demo en vez de dejar que se muestre la elección.

Así el primer paso `goto` cae en contenido, no en una pantalla que el recorrido tendría que saltar.

### Con el dev server del proyecto (para iterar con tu código vivo)

1. Arranca el proyecto con su base: `vite --base=/mobile/apps/<id>/ --port 5173`.
2. En `mobile/apps/<id>/app.json` agrega `"proxy": "http://localhost:5173"`.
3. `npm run dev` reenvía `/mobile/apps/<id>/*` a tu dev server, y sigue siendo el mismo origen.
4. Tras editar, usa **⟳ Recargar app** (el HMR por websocket no pasa por el marco).

Antes de commitear, reemplaza el proxy por el build real (`--desde`) para que la demo corra sin tu dev server.

## 3. Escribir los casos

`casos.js` define `window.CASOS`. Un caso:

```js
{ id: "1.1", titulo: "Abrir el detalle", falta: "No hay datos reales.",
  steps: [
    { t: "goto", body: "Empezamos en el inicio." },          // sin url: va a «inicio» de app.json
    { t: "note", sel: "h1", body: "Esta es la lista." },     // resalta sin pulsar
    { t: "click", sel: "a.card", body: "Abrimos la tarjeta." }
  ] }
```

- Todo caso empieza con `goto` y sigue por la navegación real (regla 3).
- `body` es una frase corta de lo que está pasando. `falta` es lo que el diseño aún no resuelve.
- Si un selector no existe, el paso falla con «No se encontró…»: arréglalo, no lo silencies.

## 4. Modo dev (`?dev=1`)

Muestra una etiqueta roja DEV y un panel con:

- **◎ Elegir elemento:** al pulsar algo en el teléfono (no ejecuta el clic) agrega
  `{ t: "click", sel: "…", body: "" },` al cuadro y lo copia al portapapeles. Pega en `steps`.
- **Tamaño del teléfono:** iPhone SE, iPhone 15 o Pixel 8.
- **⟳ Recargar app:** recarga el iframe sin perder el caso.
- El selector de **App** de la cabecera cambia de demo sin recargar la página.

Flujo típico: `Siguiente` hasta la pantalla que falta → ◎ Elegir elemento → pulsar → pegar el paso → `Reiniciar` y probar.

## 4b. El marco (cabecera, teléfono, panel)

- **Cabecera:** logo Naowee + `nombre` de `app.json` y subtítulo (`subtitulo`, opcional; por defecto «Demo móvil»), selector de App, botón **Casos** (abre/cierra el panel) e interruptor **Vista plana**.
- **Vista plana** (en todos los modos, no solo dev): la app a pantalla completa, sin teléfono ni franjas. **Esc** vuelve (también con el foco dentro de la app).
- **Teléfono:** el marco dibuja la barra de estado (9:30, isla, señal/batería) y el indicador de inicio como franjas arriba y abajo; la app va entre ambas, sin saber que existen. Color de las franjas: `"estatus": "#fff"` en `app.json` (opcional; blanco por defecto; el texto se vuelve claro u oscuro solo). Tras cambiarlo, `npm run registrar`.
- **Controles flotantes** (arriba a la derecha del escenario): zoom −, ajustar, zoom +, y ▷ que reinicia el caso. El zoom va de 50 % a 200 % sobre el ajuste automático; con zoom mayor el escenario se desplaza. En pantallas < 700 px se ocultan (el teléfono ya ocupa el ancho).
- **Panel de casos:** abierto por defecto en ≥ 1100 px (a un lado del teléfono); en menos ancho flota como cajón a la derecha y, en < 700 px, como hoja inferior. Cerrado de inicio fuera de ≥ 1100 px.

## 5. Antes de dar la demo por lista

- [ ] Cada caso corre de punta a punta en **Paso a paso** y en **Automático**.
- [ ] Ningún paso depende de un servicio ni de datos de tu máquina.
- [ ] La app arranca sin pantalla de inicio propia.
- [ ] `falta` escrito en cada caso que no cubra todo.
- [ ] Revisada a 375 px (iPhone SE) y a 412 px.
- [ ] Sin service worker ni rutas absolutas (`/assets/…`).
