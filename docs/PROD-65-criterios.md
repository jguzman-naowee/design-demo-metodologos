# PROD-65 · Acceso web para metodólogos — criterios de aceptación

Tarea de **discovery con prototipo**: el resultado es una decisión de producto (hacer, no hacer o posponer), no una orden de desarrollo.
Origen: solicitud del COC en PROD-57. Prototipo: este repo, experiencia **Plataforma web** (`web/?app=metodologos`).

Cada criterio dice **cómo se comprueba**. Los del bloque A se revisan en la demo; los de B a D necesitan a otra persona.

---

## A. El prototipo web está completo

### A1. Entrada y separación de experiencias
- [ ] El inicio pregunta «¿Qué experiencia quieres ver?» con dos opciones: **App móvil** (etiqueta «App actual») y **Plataforma web** (etiqueta «Propuesta en validación»).
- [ ] La web se ve en una ventana de escritorio 16:9, no como un celular estirado. El tamaño se elige entre 1280 × 720 y 1920 × 1080 y solo se reduce para caber en la pantalla.
- [ ] Desde cualquier pantalla, «Volver» regresa al selector de experiencia.
- [ ] «Vista plana» muestra solo la plataforma a pantalla completa; se sale con el mismo interruptor o con Esc.
- [ ] En web se entra directo al inicio de sesión, sin splash.

*Cómo se comprueba:* abrir la demo, entrar a cada experiencia y volver.

### A2. Mis eventos
- [ ] Las tarjetas muestran imagen, nombre, estado, fecha y lugar, con la flecha para entrar. Solo datos que ya existen en la app.
- [ ] Un evento finalizado con plazo vigente muestra «Editable hasta el …» sobre la imagen; al pasar el mouse explica el plazo de 10 días.
- [ ] El buscador ocupa el ancho disponible y el filtro «Estado» queda a la derecha.

### A3. Detalle del evento
- [ ] La cabecera muestra el evento y el resumen «N deportes por calificar» con «Ver lista».
- [ ] «Ver lista» abre los deportes en una lista de una columna, separados en individuales y de conjunto, como en la app.
- [ ] Pestañas «Deportes individuales» y «Deportes de conjunto».
- [ ] Tabla de deportistas con buscador a todo el ancho, filtros de Estado y Deporte, filas alternadas (cebra), borde propio y paginación.

### A4. Perfil del deportista y perfil propio
- [ ] El perfil tiene la cabecera del deportista y debajo el título «Perfil» con la tarjeta de pestañas Datos / Pruebas / Historial, a todo el ancho y sin columna lateral.
- [ ] El perfil del metodólogo sigue la misma estructura y se abre desde el menú lateral («Mi cuenta → Perfil») y desde el menú del usuario.

### A5. Evaluación
- [ ] La evaluación es un asistente de 3 pasos (Datos generales, Evaluación, Cierre) con la barra de pasos arriba y las acciones abajo.
- [ ] Las barras fijas solo muestran sombra cuando hay contenido pasando por detrás.
- [ ] Al enviar se confirma en un diálogo y se muestra la carga hasta registrar la evaluación.

### A6. Menú, encabezado y avisos
- [ ] Menú lateral con «Eventos» y «Perfil»; sin «Conoce más» ni pie de derechos reservados.
- [ ] Encabezado con campana de avisos y menú del usuario (avatar, nombre y rol).
- [ ] Los avisos llegan a la campana y llevan a la pantalla correspondiente.

### A7. Estados de carga, error y vacío
- [ ] Al entrar a Mis eventos, Detalle del evento, Perfil del deportista y Perfil se ve un skeleton con la forma de la pantalla antes del contenido.
- [ ] El selector «Estado» del marco permite mostrar en cada pantalla: **Cargando**, **Error** (con «Reintentar»), **Sin conexión** y **Vacío**, con un mensaje propio por pantalla.
- [ ] Con Error o Sin conexión, enviar una evaluación falla con un aviso y el formulario conserva lo escrito.

### A8. Recorrido de casos
- [ ] El botón «Casos» abre el panel fuera de la ventana de escritorio, sin taparla.
- [ ] Los casos del móvil corren en web; los que no aplican (6.3 aviso al gestor; 1.3 «Conoce más») aparecen deshabilitados con su motivo.

---

## B. Validación con el COC
- [ ] **B1.** El COC (o metodólogos) recorrió el prototipo web y confirmó el motivo del acceso desde el computador: ingreso más cómodo, evaluaciones largas o trabajo después de la competencia.
- [ ] **B2.** Sus observaciones quedan registradas en PROD-65.
- [ ] **B3.** Está definido si la evaluación web aplica a todos los metodólogos o solo a algunos deportes.

## C. Definición técnica (con desarrollo)
- [ ] **C1.** Desarrollo confirma si es viable y con qué esfuerzo aproximado. Hoy la evaluación vive solo en la app móvil.
- [ ] **C2.** Está definido si web y celular comparten los datos, y qué pasa con una evaluación empezada en un canal y terminada en el otro.
- [ ] **C3.** Están definidos el rol y los permisos del metodólogo en la web, y si ya existen.
- [ ] **C4.** Está definido el comportamiento real de los estados de carga, error y sin conexión (reintentos y guardado de lo escrito).

## D. Decisión
- [ ] **D1.** Hay una recomendación escrita en PROD-65: hacer, no hacer o posponer, con el alcance mínimo si se hace.
- [ ] **D2.** Si se hace, existen las tareas de diseño y desarrollo vinculadas a PROD-65.

---

## Por confirmar
- Quién del COC valida el caso de uso (por ejemplo Paulo, de PROD-57).
- Relación con la tarea de alertas automáticas de evaluación, también pedida en PROD-57.
