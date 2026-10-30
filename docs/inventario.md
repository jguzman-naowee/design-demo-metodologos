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
| 7 | Perfil del deportista | `#/deportista/<id>` | Fila de deportista | **Individual:** «Perfil del deportista», «Calificar deportista», una card por prueba (Iniciar formulario / Ver evaluación / Editar evaluación / «No se puede calificar» con motivo). **Integrante de equipo:** informativo, «Este deportista se califica como parte del equipo…» | `deportistas/.../deportista_perfil_page.dart` | no |
| 8 | Perfil del deporte (conjunto) | `#/deportista/<id>` (equipo) | Fila de equipo | «Perfil del deporte», «Calificar equipo» (una sola evaluación), «Integrantes del equipo» (informativos; vacío «El equipo se encuentra sin integrantes»), botón «Calificar en conjunto» | idem | no |
| 9 | Formulario de evaluación | `#/evaluacion` | «Iniciar formulario» / «Ver evaluación» / «Editar evaluación» | **Crear** (editable), **solo lectura** («Volver al perfil»), **editar** (plazo «Puedes editar hasta el…» / «El plazo de edición terminó el…»), **conjunto** (delegación/institución, países en la prueba, no. de atletas) | `evaluacion/.../evaluacion_formulario_page.dart` | no |
| 10 | Confirmar envío / cambios | (pantalla modal de #9) | «Guardar evaluación» | «Confirmar envío» vs «Confirmar cambios» | `shared/design_system/molecules/oc_confirm_screen.dart` | no |
| 11 | Mi perfil | `#/perfil` | Tab «Mi perfil» | Avatar + nombre + rol + «Info. Personal» (email) + «Cerrar sesión» | `perfil/.../mi_perfil_page.dart` | no |
| 12 | Bottom nav | (en #2 y #11) | — | Tabs «Eventos» / «Mi perfil», activo en naranja con subrayado | `shared/widgets/oc_bottom_nav.dart` | sí |
| 13 | Actualización obligatoria | `#/actualizar` | Guard de versión al arrancar (si la versión no es aceptada) | Con botón «Actualizar» (hay tienda) / sin botón (app sin publicar); sin salida | `app_guard/.../update_required_page.dart` | no |
| 14 | Visor PDF / WebView | — | «Visítanos» (landing), Política/Términos | Spinner de carga; error con «Reintentar» / «Abrir en el navegador» | `shared/widgets/oc_pdf_viewer_page.dart`, `oc_web_view_page.dart` | no (sitio externo; la demo avisa con un toast) |

## 2. Flujos (cada uno es un caso)

| Id | Flujo | Pantallas | Estado |
|---|---|---|---|
| 1.1 | Iniciar sesión | Login → «Iniciar sesión» (Keycloak) → Eventos | caso hecho |
| 1.2 | Filtrar eventos por estado | Eventos + sheet | caso hecho (la búsqueda por texto no se puede teclear desde un caso) |
| 1.3 | Abrir «Conoce más» | Eventos + panel | caso hecho |
| 2.1 | Abrir un evento y filtrar deportistas (Estado + Género → Aplicar) | Eventos → Detalle + sheet | caso hecho |
| 2.2 | Limpiar los filtros de deportistas | Detalle + sheet (Limpiar / Aplicar) | caso hecho |
| 2.3 | Deportes individuales vs. de conjunto (pestañas) | Detalle | caso hecho |
| 2.4 | Ver los deportes a calificar | Detalle + hoja informativa | caso hecho |
| 3.1 | Abrir el perfil de un deportista | Detalle → Perfil del deportista | caso hecho |
| 3.2 | Perfil del deporte e integrante de equipo (informativo) | Detalle (conjunto) → Perfil del deporte → Perfil del integrante | caso hecho |
| 4.1 | Calificar una prueba individual: formulario y errores de validación | Perfil → Formulario | caso hecho (parcial: no se puede escribir, no llega a «Confirmar envío») |
| 4.2 | Calificar un deporte de conjunto | Perfil del deporte → «Calificar en conjunto» → Formulario | caso hecho (parcial, igual que 4.1) |
| 4.3 | Ver una evaluación registrada (solo lectura) | Perfil → Formulario solo lectura → Perfil | caso hecho |
| 5.1 | Ver Mi perfil y cerrar sesión | Tab Mi perfil → Login | caso hecho |
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

**Extra:** `e3` no existe en `coc_sample.dart`. Se añadió (nombre acorde con su portada `Evento3.png`) para que el filtro «Finalizado» y el aviso de plazo tengan un caso. Marcado con `extra: true`.

## 4. Inicio propio (se quita en la demo)

- **Splash / BootGate** (`oc_splash_page.dart`, `boot_gate.dart`): valida sesión y precarga eventos. Se quita: la app arranca en `#/login`.
- **WebView de Keycloak** (`auth_webview_page.dart`): se reproduce su pantalla «Iniciar sesión» en `#/iniciar-sesion` (barra «‹ Iniciar sesión» + formulario); no pide ni valida datos y entra con sesión simulada en memoria. Los demás casos arrancan ya con sesión (`index.html?sesion=1#/eventos`).
- **Guard de versión** (`app_guard`): en la app real corre antes del login; en la demo es una pantalla alcanzable por ruta (caso 4.1), no un paso previo.
- Sin onboarding ni selector de plataforma.

## 5. Notas de fidelidad

- El proyecto no usa transiciones de página propias en la demo (hash routing, cambio directo). El panel «Conoce más» y los sheets sí animan (250 ms).
- Pull-to-refresh y spinner de carga no se reproducen (no hay red).
- El marco del teléfono no dibuja barra de estado ni home indicator: `--safe-top` / `--safe-bottom` quedan en 0 (`css/tokens.css`).
