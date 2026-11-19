# Spec de diseño · Calificación individual en pruebas de conjunto

**Estado:** decisiones cerradas el 19-nov-2026 · **Relacionado:** `web-prd-calificacion-individual-conjunto.md`, `web-spec-tecnica-calificacion-individual-conjunto.md`

## 1. Decisiones
| # | Decisión | Elegido |
|---|---|---|
| D1 | Cómo se califica a un integrante | Se ve la **lista de integrantes del conjunto** y se elige a quién calificar. La acción vive en la fila. Las calificaciones no son un flujo continuo: son **individuales, una a la vez**. Se califica al equipo, se termina, y después se puede hacer una individual. |
| D2 | Equipo frente a individual | **Dos secciones separadas**, no una lista mezclada con etiquetas. |
| D3 | Móvil | Perfil del deporte con **dos pestañas: Calificar e Historial**, igual que el perfil del deportista individual. |
| D4 | Pendientes | **Solo etiqueta de estado** («Sin calificar» / «Calificado»). Sin contador «N de M». |

## 2. Estructura de pantalla

### 2.1 Perfil del deporte → Pruebas (web) / Calificar (móvil)
1. Encabezado del deporte (sin cambios).
2. **Sección «Evaluación del equipo»**: una fila por prueba con su estado y la acción (`Calificar en conjunto`, `Editar evaluación`, `Ver evaluación`).
3. **Sección «Evaluaciones individuales»**: la lista de integrantes. Cada fila: avatar, nombre, estado y acción por prueba.
   - Elegir una fila abre el formulario de ese integrante. No hay cola ni «siguiente integrante».

### 2.2 Perfil del integrante
- Pestañas **Datos · Pruebas · Historial** (web); en móvil **Calificar · Historial**.
- Aviso informativo: tiene dos evaluaciones posibles y son independientes.
- Pruebas muestra solo las suyas. El historial muestra las individuales (editables dentro del plazo) y la del equipo (solo ver).

### 2.3 Historial del deporte
- Pestaña nueva en web (y pestaña Historial en móvil).
- Dos secciones separadas: «Evaluación del equipo» y «Evaluaciones individuales», agrupada por integrante.
- «Descargar historial» una sola vez, arriba, para el historial del equipo.

### 2.4 Formulario
- Mismo asistente de 3 pasos.
- Paso 1 individual: Deportista, Deporte, **Equipo** y Prueba precargados y de solo lectura. Países y número de atletas se mantienen: es el mismo formulario.
- Al guardar o cancelar, vuelve a la pantalla de origen.

## 3. Estados de una fila
| Estado | Etiqueta | Acción |
|---|---|---|
| Sin calificar, evaluable | Sin calificar | Iniciar calificación |
| Calificado, dentro del plazo | Calificado | Editar evaluación |
| Calificado, fuera del plazo | Calificado | Ver evaluación |
| Evento sin iniciar | Sin calificar | No se puede calificar |

## 4. Reglas de diseño
- Se usan los componentes y jerarquía ya definidos (`app-jerarquia-visual.md`): botón primario para «Iniciar calificación» y secundario para «Editar» y «Ver».
- Los iconos de lápiz (editar) y ojo (ver) siguen el patrón actual del historial.
- Sin elementos nuevos del SDK: no se inventa un componente de lista; se reutilizan fila, etiqueta de estado y botón.
- Español formal; sin colores ni textos por tenant.

## 5. Pendiente de confirmar
- Texto exacto del aviso del perfil del integrante.
- Si «Evaluaciones individuales» muestra todas las pruebas de cada integrante en la fila o solo la primera con un detalle.
- Cómo se ve la lista con 15 o más integrantes (paginación o búsqueda): hoy los equipos de la demo tienen 3 o 4.

## 6. Qué cambia en el HTML de compartir
El documento gráfico mostraba una lista mezclada con etiquetas. Debe pasar a **dos secciones separadas** en el perfil del deporte y en el historial, según D2.
