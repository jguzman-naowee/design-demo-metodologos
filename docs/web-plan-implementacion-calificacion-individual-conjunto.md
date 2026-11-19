# Plan de implementación · Calificación individual en pruebas de conjunto

**Estado:** propuesto · **Spec:** `web-spec-tecnica-calificacion-individual-conjunto.md` · **Diseño:** `web-spec-diseno-calificacion-individual-conjunto.md`

**Rama sugerida:** `feat/calificacion-individual-conjunto`, desde `feat/selector-experiencia` si sigue abierta, o desde `main`.

Un commit por capa revisable. Cada paso se verifica en **web y móvil** antes de seguir.

## Pasos
| # | Capa | Qué se hace | Archivos | Verificación |
|---|---|---|---|---|
| 1 | Datos | Cada integrante hereda las pruebas de su equipo (nombre y evento), con estado propio *(hecho)* | `data.js`, `data-deportistas.js` | El integrante tiene pruebas; el estado del equipo no cambia |
| 2 | Evaluaciones | Confirmar que `Evaluaciones.save/get` funciona con el id del integrante; sin cambio de firma | `data-evaluacion.js` | Guardar para `c2-m1` no altera al equipo `c2` |
| 3 | Formulario | Mismo formulario individual con la fila «Equipo» en la identificación del integrante | `screens/evaluacion.js` | El integrante muestra su equipo; el resto del formulario no cambia |
| 4 | Perfil del deporte | Dos secciones: equipo e individuales con acción por fila | `screens/deportista.js` | Se califica un integrante sin tocar al equipo, y al revés |
| 5 | Perfil del integrante | Pestaña Pruebas, aviso nuevo, historial con la del equipo en solo ver | `screens/deportista.js` | Retorno al perfil de origen |
| 6 | Historial | Pestaña Historial del equipo (web), pestañas Calificar/Historial (móvil); dos secciones | `screens/deportista.js` | Aparece lo guardado, separado |
| 7 | Excel | Dos descargas separadas: equipo y deportista | `xlsx.js` | Cada archivo solo trae lo suyo |
| 8 | Casos de la demo | Reescribir 3.2, 3.4 y 4.2; añadir el caso de integrante | `casos.js`, `casos-detalle.js`, `casos-web.js`, `web-casos.js` | El recorrido guiado completo corre |
| 9 | Docs | Actualizar PROD-65 §5 y §7.1 y el inventario de pantallas; CHANGELOG | `docs/*` | Sin referencias a «integrante informativo» |

## Orden y dependencias
- 1 → 2 → 3 son la base y van primero.
- 4, 5 y 6 se apoyan en 1–3 y se pueden hacer en ese orden.
- 7 depende de 6. 8 y 9 van al final.

## Qué queda fuera
- La integración real con el back (aún no existe): la demo simula en memoria.
- Indicador «N de M calificados».
- Cualquier cambio de formulario o de plazo.

## Riesgos de ejecución
- Las pantallas se comparten entre web y móvil con ramas `esWeb()`: cada paso se prueba en las dos.
- Los integrantes hoy no se parecen a lo que dice `coc_sample.dart`; los datos nuevos son de demostración.
- `coc_sample.dart` no trae evaluaciones de integrantes: los datos nuevos son de demostración y deben decirlo.
- El cambio de datos (paso 1) puede alterar conteos del evento que hoy se calculan sobre equipos; revisar el resumen «N deportes por calificar».

## Cierre
- Un commit por paso, con el porqué en el cuerpo. Antes de cada commit se muestra qué archivos entran y se espera el sí.
- Nada se sube sin que lo pidas.
