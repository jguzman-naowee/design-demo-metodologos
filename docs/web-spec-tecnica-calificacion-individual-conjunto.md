# Spec técnica · Calificación individual en pruebas de conjunto

**Estado:** borrador · **Cubre:** plataforma web y app móvil (misma base de código en la demo) · **Producto:** `web-prd-calificacion-individual-conjunto.md` · **Diseño:** `web-spec-diseno-calificacion-individual-conjunto.md` · **Plan:** `web-plan-implementacion-calificacion-individual-conjunto.md`

> El back **aún no soporta** evaluaciones por integrante; el plan está aprobado y se construirá. Esta spec define el contrato que el back debe cumplir y cómo la demo lo simula mientras tanto.

---

## 1. Estado actual (verificado en el código)
- Una evaluación se guarda por **sujeto + índice de prueba**: la clave es `depId + "|" + idx` (`data-evaluacion.js`).
- Un equipo es un `DeportistaVm` con `tipo: "Conjunto"` y `miembros[]`. Cada integrante es otro `DeportistaVm` (`esMiembroEquipo: true`, `pruebas: []`) y hoy **no tiene pruebas propias**: su estado está fijo en los datos.
- El estado de un sujeto es «Calificado» solo si todas sus pruebas lo están (`Evaluaciones.save`).
- Ruta del formulario: `#/evaluacion/:deportistaId/:pruebaId`; el sujeto decide equipo o individual por `esEquipo`.
- Plazo de edición fijo en la demo: `PLAZO_EDICION = "2026-09-02"`.

## 2. Modelo propuesto

### 2.1 Entidades
- **Prueba de conjunto**: pertenece al equipo y al evento. Es el ancla de las dos evaluaciones.
- **Evaluación de equipo**: una por prueba. Sujeto = equipo.
- **Evaluación individual**: una por (integrante, prueba). Sujeto = integrante, con referencia al equipo.

Ambas llevan `targetType` (el campo ya existe: hoy `"ATHLETE"`): `"TEAM"` o `"ATHLETE"`. Una evaluación individual de conjunto añade `teamId` y `pruebaId` de la prueba del equipo.

### 2.2 Cambios de datos en la demo
| Dónde | Cambio |
|---|---|
| `data.js` (`miembro(...)`) | Cada integrante recibe **sus propias pruebas**, copia de las del equipo (mismo nombre y `eventoId`), con estado propio. Hoy `pruebas: []`. |
| `data-evaluacion.js` | La clave pasa a `sujetoId + "\|" + idx`, donde el sujeto puede ser el equipo o el integrante. Ya funciona porque los integrantes tienen id propio (`c2-m1`); solo se necesita que tengan pruebas. |
| `Evaluaciones.save` | Sin cambio de firma. Como el estado del integrante sale de sus pruebas, el del equipo **deja de mirar a los integrantes** (ya es así: solo mira `d.pruebas`). |
| `Data.equipoDeMiembro` | Ya existe; se usa para el retorno y para mostrar el equipo en el formulario individual. |

### 2.3 Contrato del back (a validar con quien lo construya)
- Crear y leer evaluación con `targetType: "TEAM" | "ATHLETE"`, y para conjunto: `teamId`, `participantId`, `testId`.
- Unicidad: una evaluación por (`targetType`, sujeto, prueba). Un integrante puede tener la suya y el equipo la suya sin conflicto.
- Los campos `countries` y `athletesCount` solo se exigen cuando `targetType = "TEAM"`.
- Listar el historial: por equipo (solo `TEAM`) y por deportista (sus `ATHLETE`, de equipo o individuales, más la del equipo como solo lectura).
- Plazo de edición: el mismo cálculo del evento para ambas.
- **Pendiente:** confirmar nombres reales de campos y endpoints; los de arriba son propuesta.

## 3. Rutas
Sin rutas nuevas. Se reutilizan:
- `#/deportista/:id` con `id` del equipo → Perfil del deporte; con `id` del integrante → Perfil del integrante.
- `#/evaluacion/:deportistaId/:pruebaId` con el id del equipo o del integrante. El formulario decide el contexto por el sujeto.

El **retorno** al guardar o cancelar usa `Router.back` con ruta de respaldo: perfil del sujeto evaluado. La pantalla de origen se conserva por historial, no por parámetro.

## 4. Comportamiento por pantalla

### 4.1 Perfil del deporte (`deportista.js`, `equipo()`, `tabsWeb`)
- Hoy: «Calificar equipo» + `calificarEnConjunto(d)` + lista informativa de integrantes.
- Nuevo: dos secciones separadas dentro de Pruebas:
  1. **Evaluación del equipo**: por prueba, estado y acción (`Calificar en conjunto` / `Editar` / `Ver`).
  2. **Evaluaciones individuales**: lista de integrantes; cada fila con estado y acción por prueba. Se califica **de uno en uno**.
- Web (`tabsWeb`): el equipo pasa de `[datos, pruebas]` a `[datos, pruebas, historial]`.
- Móvil: dos pestañas **Calificar** e **Historial** (como el individual).

### 4.2 Perfil del integrante
- Deja de ser «solo informativo»: gana la pestaña Pruebas con sus propias pruebas de conjunto (`panelCalificar`).
- Se reemplaza `miembroAviso()` por un aviso de que tiene dos evaluaciones independientes.
- `historialMiembro(d)`: sus evaluaciones individuales (editables) + la del equipo (solo ver).

### 4.3 Formulario (`evaluacion.js`)
- Sujeto equipo: igual que hoy (`esEquipo`).
- Sujeto integrante de conjunto (`esMiembroEquipo`): paso 1 con deportista, equipo, deporte y prueba precargados; **sin** `countries` ni `athletesCount`.
- Validación del paso 1: `errAtletas()` solo aplica cuando `esEquipo`. Hoy `PASOS[0].campos = ["athletesCount"]`; en el individual el paso 1 no tiene campos obligatorios y «Continuar» avanza.
- Pasos 2 y 3 sin cambios.

### 4.4 Historial y Excel
- Equipo → Historial: sección «Evaluación del equipo» y sección «Evaluaciones individuales» (por integrante).
- «Descargar historial» del equipo: solo `TEAM`. «Descargar historial» del deportista: solo sus `ATHLETE`. Dos archivos, sin mezclar (`xlsx.js`).

### 4.5 Conteos
- «N deportes por calificar» del evento sigue contando solo la evaluación del equipo.
- Estado de un equipo: solo de sus pruebas, nunca de sus integrantes.

## 5. Casos límite
- **Integrante calificado y equipo sin calificar** (y al revés): válido, sin estado «parcial».
- **Equipo sin integrantes**: se mantiene «El equipo se encuentra sin integrantes» y «Calificar en conjunto».
- **Evento programado**: ambas acciones muestran «No se puede calificar» (`blockedReason`).
- **Plazo vencido**: ambas pasan a «Ver evaluación».
- **Integrante en varios eventos**: cada evaluación va ligada a su `eventoId`.
- **Integrante que sale o entra tras calificar**: la evaluación queda con el deportista (pendiente de confirmar).

## 6. Mientras el back no exista
La demo simula todo en memoria (`window.Evaluaciones`, se pierde al recargar). No se inventa un contrato: se deja la capa de datos aislada en `data-evaluacion.js` para que sustituirla por llamadas reales no toque las pantallas.

## 7. Riesgos
| Riesgo | Mitigación |
|---|---|
| El back define campos distintos a la propuesta | Aislar el contrato en una sola capa; validar §2.3 antes de integrar |
| Duplicar pruebas por integrante infla los datos de la demo | Generarlas desde las del equipo con una función, no a mano |
| La web y la móvil comparten pantallas con ramas `esWeb()`; un cambio rompe una de las dos | Probar siempre las dos, con casos por plataforma |
