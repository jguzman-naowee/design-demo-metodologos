# PRD · Calificación individual en pruebas de conjunto

**Estado:** borrador para revisión · **Alcance:** plataforma web y app móvil de Metodólogos (mismo cambio en las dos) · **Specs:** `web-spec-tecnica-…`, `web-spec-diseno-…`, `web-plan-implementacion-…` · **Relacionado:** PROD-65 (`web-criterios-aceptacion-PROD-65.md`)

---

## 1. Resumen
Hoy una prueba de un deporte de conjunto tiene **una sola evaluación, la del equipo**, y los integrantes son solo informativos. Este cambio permite además **calificar a cada integrante dentro de esa prueba**, sin quitar ni condicionar la evaluación del equipo.

## 2. Problema
- El metodólogo observa el desempeño de cada deportista durante la prueba, pero la plataforma solo le deja registrar una valoración global del equipo.
- El historial del deportista que juega en equipo queda vacío de su propio desempeño: solo ve la evaluación del equipo.

## 3. Objetivos
1. Registrar la evaluación de cada integrante en una prueba de conjunto.
2. Mantener la evaluación del equipo tal como existe.
3. Que ambas se puedan hacer **en cualquier orden y de forma independiente**.
4. Que el historial del deportista y el del equipo reflejen cada una por separado.

**No objetivos:** cambiar el formulario, el plazo de edición, los roles ni los deportes individuales.

## 4. Usuario
El **metodólogo asignado al evento**, el mismo de hoy. No hay roles ni permisos nuevos.

## 5. Modelo
Dos tipos de evaluación sobre la misma prueba de conjunto:

| | Evaluación del equipo | Evaluación individual |
|---|---|---|
| Cuántas por prueba | Una | Una por integrante |
| Sujeto | El equipo (deporte, delegación o institución) | El deportista, dentro del equipo y la prueba |
| Formulario | 3 pasos (existente) | El mismo 3 pasos |
| Países y no. de atletas | Sí | Sí: es el mismo formulario |
| Plazo de edición | 10 días tras terminar el evento | El mismo, heredado |
| Estado | Sin calificar / Calificado | Sin calificar / Calificado, propio de cada integrante |

**Reglas**
- No hay orden: se puede calificar a un integrante sin haber calificado al equipo, y al revés.
- No existe estado «parcial» del equipo ni cierre que dependa de los integrantes. Calificar a todos no es obligatorio.
- Una evaluación no modifica el estado de la otra.

## 6. Flujo
Hay dos entradas al mismo formulario:

1. **Desde el perfil del deporte → pestaña Pruebas (web) o Calificar (móvil).** Dos secciones separadas: «Evaluación del equipo» («Calificar en conjunto») y «Evaluaciones individuales», la lista de integrantes del conjunto, donde se elige a quién calificar. Cada integrante tiene su estado y su acción («Iniciar calificación», «Editar evaluación», «Ver evaluación»). Se califica **de uno en uno**: no hay cola ni flujo continuo.
2. **Desde el perfil del integrante → pestaña Pruebas.** Sus pruebas de conjunto aparecen con la misma acción que cualquier prueba individual.

Al guardar, la persona vuelve al lugar desde donde entró y ve «Quedó guardada en el historial del deportista».

## 7. Criterios de aceptación

### 7.1 Perfil del deporte
- [ ] En Pruebas (web) o Calificar (móvil) hay dos secciones separadas: «Evaluación del equipo» y «Evaluaciones individuales» (lista de integrantes con el estado de cada uno).
- [ ] Se califica a un integrante a la vez; al guardar vuelve a la lista y puede elegir otro. No hay un flujo que encadene integrantes.
- [ ] Cada integrante tiene su acción según estado y plazo: «Iniciar calificación», «Editar evaluación» (dentro del plazo) o «Ver evaluación» (fuera de él).
- [ ] La acción del equipo («Calificar en conjunto») sigue funcionando igual y no depende de los integrantes.
- [ ] Hay pestaña **Historial** (web) con dos secciones separadas: la evaluación del equipo y las de sus integrantes. En móvil, el perfil del deporte tiene las pestañas Calificar e Historial.
- [ ] Un equipo sin integrantes muestra «El equipo se encuentra sin integrantes» y conserva «Calificar en conjunto».

### 7.2 Perfil del integrante
- [ ] En Pruebas aparecen sus pruebas de conjunto con «Iniciar calificación», «Editar evaluación» o «Ver evaluación».
- [ ] La alerta «Este deportista se califica como parte del equipo…» se reemplaza por una que explique que tiene dos evaluaciones posibles: la suya y la del equipo.
- [ ] En Historial ve sus evaluaciones individuales (editables dentro del plazo) y la del equipo (solo ver; se edita desde el perfil del deporte).

### 7.3 Formulario
- [ ] Mismo asistente de 3 pasos y mismas reglas de campos, validación, confirmación y guardado que en PROD-65 §7.
- [ ] En el paso 1, la identificación precargada de la evaluación individual muestra deportista, deporte, **equipo** y prueba, sin poder editarse. El resto del formulario (países, no. de atletas, pasos 2 y 3) es idéntico al de cualquier evaluación individual.
- [ ] Al guardar o cancelar, vuelve a la pantalla de origen (perfil del deporte o del integrante).

### 7.4 Estados y conteos
- [ ] El estado de cada evaluación es independiente; calificar una no cambia la otra.
- [ ] El resumen «N deportes por calificar» del evento sigue contando solo la evaluación del equipo. Los integrantes sin calificar no suman.
- [ ] Antes de que inicie el evento, las acciones de calificación individual muestran «No se puede calificar», igual que las del equipo.

### 7.5 Descargas
- [ ] El equipo no tiene «Descargar historial»: la calificación en conjunto aparece en el historial de cada integrante.
- [ ] «Descargar historial» del deportista entrega su Excel con sus evaluaciones individuales y, como fila aparte, la del equipo al que pertenece (es el mismo registro del equipo, no una copia). Confirmado con desarrollo; falta que el back lo incluya.
- [ ] Los dos archivos son separados y no se mezclan.

## 8. Decisiones tomadas
| Tema | Decisión |
|---|---|
| ¿Es obligatorio calificar a todos? | No, queda a criterio del metodólogo. |
| ¿Orden entre equipo e individuales? | Cualquiera. |
| ¿Plazo de edición? | El del evento, heredado. |
| ¿Formulario? | El mismo. |
| ¿Quién califica? | El mismo metodólogo asignado. |
| ¿Excel? | Solo el del deportista, con la evaluación del equipo como fila aparte. El equipo no tiene descarga (ajuste por comentario de desarrollo, 20-nov-2026). |
| ¿Conteo del evento? | Solo la evaluación del equipo. *Propuesta pendiente de confirmar.* |
| ¿Cómo se elige a quién calificar? | Lista de integrantes del conjunto con acción en la fila; una calificación a la vez, sin flujo continuo. |
| ¿Equipo frente a individual en pantalla? | Dos secciones separadas. |
| ¿Móvil? | Mismo cambio; el perfil del deporte con pestañas Calificar e Historial. |
| ¿Indicador de avance? | No: solo etiqueta de estado. |
| ¿Back? | Aún no lo soporta; el plan está aprobado y se construirá. La demo simula en memoria. |

## 9. Preguntas abiertas
1. ¿Confirmamos que el conteo «deportes por calificar» no incluye integrantes?
2. ¿Un integrante que sale del equipo o se agrega después de calificar conserva su evaluación? Se asume que sí, ligada al deportista.
3. Cómo se ve la lista con muchos integrantes (paginación o búsqueda).
4. Contrato real con el back (campos y endpoints): ver la spec técnica.

## 10. Impacto en lo ya documentado
- `web-criterios-aceptacion-PROD-65.md`: §5 (perfil), §7.1 (entrada) y la regla «en conjunto la evaluación es del equipo».
- `app-inventario-pantallas.md`: filas 7, 8 y 9, y los casos 3.2, 3.4 y 4.2.
- Demo: `deportista.js`, `evaluacion.js`, `data-deportistas.js` y `data-evaluacion.js` (la clave de evaluación pasa a distinguir equipo de integrante).
