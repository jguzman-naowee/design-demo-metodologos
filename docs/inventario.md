# Inventario de la app de Metodólogos (COC)

Fuente: app Flutter `app-mobile-olympic-cycle` (`lib/features/*/presentation/pages`, `lib/shared`). Un solo rol de trabajo: **Metodólogo**. Lo que cambia no es el rol sino el **tipo de deporte** (individual vs. conjunto) y el **estado** de cada prueba.

Columna «Cubierta»: qué casos de `mobile/apps/metodologos/casos.js` recorren la pantalla; **parcial** = se recorre pero queda una variante fuera (ver «Sin cubrir»); **no** = ningún caso llega.

## 1. Pantallas

| # | Pantalla | Ruta demo | Cómo se llega | Variantes | Origen Flutter | Cubierta |
|---|---|---|---|---|---|---|
| 1 | Login | `#/login` | Arranque sin sesión; cerrar sesión; guard | Aviso «Tu sesión expiró» (snackbar, solo si expiró) | `auth/.../login_page.dart` | sí |
| 2 | Eventos | `#/eventos` | Tras ingresar; logo de la barra; tab «Eventos» | Con resultados / sin eventos asignados / sin coincidencias; tarjeta finalizada con aviso de plazo de edición | `eventos/.../eventos_page.dart`, `oc_evento_card.dart` | sí |
| 3 | Sheet «Filtrar por estado» | (sheet de #2) | Pastilla «Estado» | Multi-selección En curso / Programado / Finalizado | `oc_estado_filter_sheet.dart` | sí |
| 4 | Panel «Conoce más» | (panel de cualquier pantalla con barra) | Icono hamburguesa | Entra por la derecha (no es bottom sheet); «Visítanos» abre la landing en un WebView | `shared/widgets/oc_conoce_mas_sheet.dart` | sí (sin landing) |
| 5 | Detalle de evento | `#/evento/<id>` | Tarjeta de evento | Pestañas «Deportes individuales» / «Deportes de conjunto»; búsqueda «Buscar deportista»; sección «Deportes a calificar en este evento»; vacío «sin coincidencias» | `eventos/.../evento_detalle_page.dart`, `oc_deportes_calificar_section.dart`, `oc_deportista_tile.dart` | no |
| 6 | Sheet «Filtrar deportistas» | (sheet de #5) | Botón de filtro del detalle | Estado de calificación (Sin calificación / Calificado) y Género; «Limpiar» / «Aplicar» | `oc_deportista_filter_sheet.dart` | no |
| 7 | Perfil del deportista | `#/deportista/<id>` | Fila de deportista | **Individual:** «Perfil del deportista» con dos pestañas. **Calificar**: solo las pruebas del evento por el que se entró (pendientes y las aún editables). **Historial**: todas las evaluaciones completadas de todos los eventos del ciclo, agrupadas por evento, con «Descargar historial» (Excel). Una sola acción por evaluación: lápiz si el plazo sigue abierto, ojo (solo lectura) si no. **Integrante de equipo:** alerta «Este deportista se califica como parte del equipo…» más el historial de evaluaciones del equipo (solo ver y descargar; si aún se puede editar, la card dice que se hace desde el perfil del deporte) | `deportistas/.../deportista_perfil_page.dart` | no |
| 8 | Perfil del deporte (conjunto) | `#/deportista/<id>` (equipo) | Fila de equipo | «Perfil del deporte», «Calificar equipo» (una sola evaluación), «Integrantes del equipo» (informativos; vacío «El equipo se encuentra sin integrantes»), botón «Calificar en conjunto» | idem | no |
| 9 | Formulario de evaluación | `#/evaluacion` | «Iniciar formulario» / «Ver evaluación» / «Editar evaluación» | **Crear** (editable), **solo lectura** («Volver al perfil»), **editar** (plazo «Puedes editar hasta el…» / «El plazo de edición terminó el…»), **conjunto** (delegación/institución, países en la prueba, no. de atletas) | `evaluacion/.../evaluacion_formulario_page.dart` | no |
| 10 | Confirmar envío / cambios | (pantalla modal de #9) | «Guardar evaluación» | «Confirmar envío» vs «Confirmar cambios» | `shared/design_system/molecules/oc_confirm_screen.dart` | no |
| 11 | Mi perfil | `#/perfil` | Tab «Mi perfil» | Avatar + nombre + rol + «Info. Personal» (email) + «Cerrar sesión» | `perfil/.../mi_perfil_page.dart` | no |
| 12 | Bottom nav | (en #2 y #11) | — | Tabs «Eventos» / «Mi perfil», activo en naranja con subrayado | `shared/widgets/oc_bottom_nav.dart` | sí |
| 13 | Actualización obligatoria | `#/actualizar` | Guard de versión al arrancar (si la versión no es aceptada) | Con botón «Actualizar» (hay tienda) / sin botón (app sin publicar); sin salida | `app_guard/.../update_required_page.dart` | no |
| 15 | Inicio del celular (simulado, **extra de la demo**) | `#/celular?ntf=compite\|termino\|recibida` | solo desde los casos 6.x | Inicio de un celular con widgets, iconos y la app instalada; el aviso baja desde arriba con insignia en el icono. Tocarlo abre la app en el perfil del deportista (Metodólogo) o explica que se abre en la plataforma web (Gestor) | `data-alertas.js`, `screens/celular.js` | sí |
| 16 | Bandeja de notificaciones (**extra de la demo**) | `#/notificaciones` | Campana de la barra superior (con insignia de avisos sin leer) | título con un icono de doble chulo (marcar todas como leídas); pestañas «Recientes» (contador de nuevos) y «Todas» (total); filas planas con nombre en negrita, hora, prueba y evento; los nuevos con punto y fondo suave; vacío por pestaña; tocar un aviso abre el perfil del deportista y lo marca leído | `data-alertas.js`, `screens/notificaciones.js` | sí |
| 14 | Visor PDF / WebView | — | «Visítanos» (landing), Política/Términos | Spinner de carga; error con «Reintentar» / «Abrir en el navegador» | `shared/widgets/oc_pdf_viewer_page.dart`, `oc_web_view_page.dart` | no (sitio externo; la demo avisa con un toast) |

## 2. Flujos (cada uno es un caso)

| Id | Flujo | Pantallas | Estado |
|---|---|---|---|
| 1.1 | Iniciar sesión | Splash → formulario de inicio de sesión → Eventos | caso hecho |
| 1.2 | Filtrar eventos por estado | Eventos + sheet | caso hecho (la búsqueda por texto no se puede teclear desde un caso) |
| 1.3 | Abrir «Conoce más» | Eventos + panel | caso hecho |
| 2.1 | Abrir un evento y filtrar deportistas (Estado + Género → Aplicar) | Eventos → Detalle + sheet | caso hecho |
| 2.2 | Limpiar los filtros de deportistas | Detalle + sheet (Limpiar / Aplicar) | caso hecho |
| 2.3 | Deportes individuales vs. de conjunto (pestañas) | Detalle | caso hecho |
| 2.4 | Ver los deportes a calificar | Detalle + hoja informativa | caso hecho |
| 2.5 | Ver mis atletas y equipos en un evento programado (Dakar: boxeo, lucha, esgrima, baloncesto 3x3 y rugby 7); las pruebas quedan bloqueadas, «El evento aún no inicia» | Eventos → Detalle → Perfil / Perfil del deporte | caso hecho |
| 3.1 | Abrir el perfil de un deportista | Detalle → Perfil del deportista | caso hecho |
| 3.2 | Perfil del deporte e integrante de equipo (informativo) | Detalle (conjunto) → Perfil del deporte → Perfil del integrante | caso hecho |
| 3.3 | Descarga de historial del atleta (individual): pestaña Historial, evaluaciones de varios eventos, «Descargar historial» | Detalle → Perfil → Historial | caso hecho |
| 3.4 | Descarga de historial del atleta (deporte de conjunto): historial del equipo desde un integrante, solo ver, edición desde el perfil del deporte | Perfil del deporte → Perfil del integrante → Evaluación solo lectura | caso hecho |
| 4.1 | Calificar una prueba individual: formulario y errores de validación | Perfil → Formulario | caso hecho (parcial: no se puede escribir, no llega a «Confirmar envío») |
| 4.2 | Calificar un deporte de conjunto | Perfil del deporte → «Calificar en conjunto» → Formulario | caso hecho (parcial, igual que 4.1) |
| 4.3 | Ver una evaluación registrada (solo lectura) | Perfil → Formulario solo lectura → Perfil | caso hecho |
| 5.1 | Ver Mi perfil y cerrar sesión | Tab Mi perfil → Login | caso hecho |
| 6.1 | Aviso al metodólogo: su deportista va a competir (30 min antes) | Inicio del celular → perfil del deportista | caso hecho |
| 6.2 | Aviso al metodólogo: su deportista terminó la prueba | Inicio del celular → perfil del deportista | caso hecho |
| 6.3 | Aviso al gestor del comité: un metodólogo registró una evaluación | Inicio del celular → aviso (la plataforma web no está en la demo) | caso hecho |
| 6.4 | Bandeja de notificaciones: la campana, los avisos guardados y abrir el perfil del deportista | Eventos → Notificaciones → Perfil del deportista | caso hecho |
| — | Confirmar envío / cambios y que la prueba quede «Calificado» | Formulario → Confirmar → Perfil | sin caso: exige escribir en los campos |
| — | Editar una evaluación dentro del plazo | Perfil → Formulario (editar) → Confirmar cambios | sin caso: ninguna prueba de los datos fijos es editable (y exige escribir) |
| — | Actualización obligatoria | Pantalla de actualización | sin caso: solo por ruta `#/actualizar` |

### Sin cubrir (resumen)

- **Escribir:** búsqueda por nombre (eventos y deportistas), llenado del formulario, «Confirmar envío», «Confirmar cambios» y el estado «Calificado» tras guardar. El marco solo pulsa y resalta (`click`/`note`/`goto`); no hay paso para teclear.
- **Variantes sin datos o sin enlace:** lista desplegable de deporte del filtro, «No se puede calificar», «Editar evaluación», equipo ya calificado, equipo sin integrantes, lista de eventos vacía, snackbar de sesión expirada.
- **Pantallas:** actualización obligatoria (#13, sin enlace desde la app), visor PDF / WebView (#14).

## 3. Datos (qué consulta la app a servicio y con qué dato fijo se reemplaza)

| Consulta real | Reemplazo en la demo (`js/data.js`) |
|---|---|
| Login Keycloak (WebView) + `/me` (usuario, roles) | `Session.login()` en memoria; usuario fijo de `coc_sample.dart`: Juan José Pérez Granados, Metodólogo, rusbel.pinto@gmail.com |
| Eventos asignados (`methodologist-assignments`, filtros `search` y `status`) | `Data.eventos`: `e1` En curso, `e2` Programado (de `coc_sample.dart`) y `e3` Finalizado (**extra de la demo**, ver abajo). Búsqueda por nombre y filtro de estado se hacen en el cliente |
| Disciplinas del evento (`disciplines`) | `Data.deportistas[].pruebas` |
| Candidatos / inscritos y equipos (`candidates`, `teams`) | `Data.individuales` (d1–d5), `Data.conjunto` (c1–c3 con sus integrantes) |
| Opiniones: crear, leer, editar (`opinions`, ventana de 10 días, `editable`/`editable_until`) | Sin red; cada pantalla guarda lo que el usuario cree en memoria |
| Guard de versión (`app_guard`) | Pantalla de actualización accesible por ruta; sin consulta |
| Fecha límite de edición (`editable_until`) | Fija: `e3` → 2026-03-18 (no depende del reloj) |

**Extra:** `e3`, `e4` y `e5` no existen en `coc_sample.dart`. En los eventos programados (`e2`, `e5`) las pruebas llevan `blockedReason: "El evento aún no inicia"`: el perfil muestra «No se puede calificar» en vez de «Iniciar formulario». `e2` tiene ahora atletas propios (d12–d15). `e5` («Juegos Olímpicos de la Juventud Dakar 2026», programado) trae una lista propia de 6 atletas (d6–d11: boxeo, lucha y esgrima) y 2 equipos con integrantes (c4 Baloncesto 3x3, c5 Rugby 7) para el caso de atletas visibles en un evento programado. `e4` («Campeonato Suramericano Juvenil 2026», en curso) permite el caso de dos eventos en curso a la vez; Javier Manríquez (d1) y Selección de Voleibol (c2) tienen evaluaciones de muestra en varios eventos para el historial. Cada prueba lleva `eventoId` (por defecto `e1`).

`e3` se añadió (nombre acorde con su portada `Evento3.png`) para que el filtro «Finalizado» y el aviso de plazo tengan un caso. Los eventos extra van marcados con `extra: true`.

## 3b. Alertas automáticas de evaluación (extra de la demo)

La app Flutter original no las trae todavía; la demo las simula en `js/data-alertas.js`. Cada alerta declara sus parámetros. El aviso se pinta con un tema del SDK de Naowee (`nwt-theme`).

| Alerta | Destinatario | Qué la dispara | Tema SDK | Al tocarla |
|---|---|---|---|---|
| `compite` | Metodólogo | 30 minutos antes de que empiece la prueba de un deportista que tiene asignado | `caution` | Abre la app en el perfil del deportista |
| `termino` | Metodólogo | Cuando termina la prueba de un deportista que tiene asignado y aún no la ha calificado | `informative` | Abre la app en el perfil del deportista |
| `recibida` | Gestor del comité | Cuando un metodólogo registra una evaluación en la plataforma | `positive` | Solo informa (la plataforma web no está en la demo) |

La bandeja (`#/notificaciones`) reúne solo los avisos dirigidos al metodólogo (`compite`, `termino`); el del gestor no entra. Alcance: solo la bandeja; sin preferencias.

Qué **no** hace la demo: no manda notificaciones push reales, no tiene reloj del evento (el celular marca siempre la misma hora) y no decide el momento exacto de cada aviso; solo muestra cómo llegan.

## 4. Inicio propio (se quita en la demo)

- **Splash / BootGate** (`oc_splash_page.dart`, `boot_gate.dart`): valida sesión y precarga eventos. Se quita: la app arranca en `#/login`.
- **Inicio de sesión:** el splash «Noche olímpica» se transforma en el formulario dentro de `#/login` (sin pantalla intermedia ni WebView de Keycloak); no pide ni valida datos y entra con la sesión simulada.
- **Guard de versión** (`app_guard`): en la app real corre antes del login; en la demo es una pantalla alcanzable por ruta (caso 4.1), no un paso previo.
- Sin onboarding ni selector de plataforma.

## 5. Notas de fidelidad

- **Movimiento (extra de la demo, `css/motion.css`):** la app original cambia de pantalla sin transición; la demo añade movimiento para que se sienta como una app. Todo menos de 300 ms, solo `transform` y `opacity`, y con `prefers-reduced-motion` queda en fundidos de 120 ms.
  - **Entre pantallas:** avanzar entra deslizando desde la derecha, volver desde la izquierda, y entre «Eventos» y «Mi perfil» sube con un fundido y el subrayado de la barra inferior crece. Lo decide el router con `data-nav` en `#app`.
  - **Desplegables:** el aviso de plazo del evento y la lista de deportes del filtro abren y cierran el alto con animación y giran su flecha. Las pestañas tienen un subrayado que se desliza.
  - **Listas y selección:** las filas de Eventos y de deportistas entran escalonadas solo al abrir la pantalla (no al buscar ni filtrar); las imágenes de evento aparecen con fundido; todo lo que se pulsa se hunde un poco; las casillas hacen un pequeño «pop».
  - **Hojas, panel lateral y avisos:** curva de iOS al entrar y salida más corta.
- Pull-to-refresh y spinner de carga no se reproducen (no hay red).
- El marco del teléfono no dibuja barra de estado ni home indicator: `--safe-top` / `--safe-bottom` quedan en 0 (`css/tokens.css`).
