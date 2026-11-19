# PROD-65 · Plataforma web para metodólogos — criterios de aceptación

Criterios de la **plataforma web** que usaría el metodólogo desde el computador. Describen el producto, no la demo que lo presenta.
Origen: solicitud del COC en PROD-57.

---

## 1. Acceso
- [ ] El metodólogo entra con su correo y contraseña de la cuenta del Comité Olímpico Colombiano, directo al formulario, sin pantalla de bienvenida animada.
- [ ] Desde el inicio de sesión puede recuperar la contraseña y ver la política de datos y los términos.
- [ ] Al entrar llega a «Mis eventos».

## 2. Estructura de la plataforma
- [ ] Menú lateral con «Eventos» (sección Evaluación) y «Perfil» (sección Mi cuenta), que marca la sección activa y se puede colapsar.
- [ ] «Cerrar sesión» al pie del menú lateral.
- [ ] Encabezado con la campana de avisos y el menú del usuario: avatar, nombre, rol y acceso a «Perfil».
- [ ] El contenido usa todo el ancho disponible sin pasar de un máximo legible; desde 900 px de ancho se ve la versión de escritorio.

## 3. Mis eventos
- [ ] Los eventos asignados se muestran en tarjetas, en cuadrícula (3 por fila en una pantalla de escritorio estándar).
- [ ] Cada tarjeta muestra imagen del evento, nombre, estado (En curso, Programado, Finalizado), fechas y lugar, y una flecha para entrar.
- [ ] Un evento finalizado que todavía se puede editar muestra «Editable hasta el ‹fecha›» sobre la imagen; al pasar el mouse explica que las evaluaciones se pueden editar hasta 10 días después de terminado el evento.
- [ ] Buscador por nombre de evento, a todo el ancho, y filtro «Estado» a su derecha.

## 4. Detalle del evento
- [ ] Cabecera con imagen, estado, nombre, fechas y lugar del evento, y «Volver a eventos».
- [ ] Resumen «N deportes por calificar»; «Ver lista» abre los deportes en una lista de una columna, separados en individuales y de conjunto.
- [ ] Pestañas «Deportes individuales» y «Deportes de conjunto», del mismo tamaño que el título de la lista.
- [ ] «Deportistas inscritos» con el total, seguido de un buscador a todo el ancho (nombre, deporte, colegio) y los filtros de Estado y Deporte.
- [ ] Tabla de deportistas (deportista, deporte, categoría, género, estado) con borde, filas alternadas, resaltado al pasar el mouse y toda la fila como enlace al perfil.
- [ ] Paginación con el conteo «Mostrando X–Y de N deportistas».

## 5. Perfil del deportista
- [ ] Cabecera con avatar, nombre, estado de calificación y colegio.
- [ ] Debajo, el título «Perfil» y una tarjeta a todo el ancho con las pestañas Datos, Pruebas e Historial.
- [ ] Datos: deporte, colegio, categoría, tipo de deporte, sexo y estado.
- [ ] Pruebas e Historial en tablas con filas alternadas, con la acción de calificar o editar según el plazo.
- [ ] El perfil de un deporte de conjunto también tiene pestañas Datos, Pruebas e Historial: Pruebas separa «Evaluación del equipo» de «Evaluaciones individuales»; Historial muestra la del equipo y las de sus integrantes por separado.

## 6. Perfil del metodólogo
- [ ] Se abre desde el menú lateral y desde el menú del usuario.
- [ ] Cabecera con nombre y rol; debajo, el título «Perfil» y la tarjeta «Info. Personal» con el correo, a todo el ancho.

## 7. Registrar evaluación

### 7.1 Entrada
- [ ] Desde el perfil del deportista, pestaña Pruebas, cada prueba sin calificar tiene «Iniciar calificación»; una ya calificada tiene «Editar evaluación» dentro del plazo y «Ver evaluación» fuera de él.
- [ ] En deportes de conjunto hay dos evaluaciones independientes por prueba: la del equipo («Calificar en conjunto», desde el perfil del deporte) y la de cada integrante (desde la lista «Evaluaciones individuales» o desde su perfil). Ver `web-prd-calificacion-individual-conjunto.md`.

### 7.2 Asistente de 3 pasos
- [ ] Barra de pasos arriba (Paso 1 Datos generales, Paso 2 Evaluación, Paso 3 Cierre) que marca el paso actual y los completados, y permite volver a un paso desde ella.
- [ ] Encima del título de cada paso se ve el evento y la prueba, en tamaño de texto normal.
- [ ] Acciones abajo, siempre visibles: «Cancelar» a la izquierda; «Atrás» (desde el paso 2) y «Continuar» a la derecha; en el último paso «Continuar» cambia a «Guardar evaluación».
- [ ] Las barras fijas solo muestran sombra cuando hay contenido pasando por detrás.
- [ ] «Atrás» vuelve al paso anterior sin perder lo escrito; «Cancelar» sale al perfil sin guardar.

### 7.3 Paso 1 · Datos generales
- [ ] **Identificación del deportista**, precargada desde la inscripción y sin poder editarse: nombre, deporte, modalidad (si aplica) y prueba. En conjunto: deporte y delegación o institución.
- [ ] **Contexto de la prueba:**
  - «Países en la prueba», opcional, nombres separados por coma.
  - «No. de atletas en la prueba», obligatorio, solo números mayores que cero.

### 7.4 Paso 2 · Evaluación técnico-metodológica
- [ ] Tres campos de texto obligatorios: «Evaluación aspecto técnico», «Evaluación aspecto táctico» y «Evaluación preparación física».

### 7.5 Paso 3 · Cierre
- [ ] Dos campos de texto obligatorios: «Conclusiones» y «Recomendaciones».

### 7.6 Reglas de los campos
- [ ] Los campos de texto aceptan hasta 1.000 caracteres y muestran el contador (por ejemplo 89/1000).
- [ ] «Continuar» valida los obligatorios del paso: marca cada campo vacío o inválido con su mensaje («Este campo es obligatorio.», «Ingresa un número válido.») y avisa «Revisa los campos obligatorios».
- [ ] Después del primer intento, los errores se corrigen en vivo mientras se escribe.

### 7.7 Guardar
- [ ] «Guardar evaluación» abre un diálogo de confirmación: «Confirmar envío» (o «Confirmar cambios» si se edita), con «No, seguir editando» y «Sí, enviar».
- [ ] Al confirmar se muestra la carga a pantalla completa y no se puede hacer otra acción hasta que termine.
- [ ] Al terminar vuelve al perfil del deportista, la prueba pasa a calificada y aparece el aviso «Quedó guardada en el historial del deportista».
- [ ] Si el envío falla, se muestra el error y el formulario conserva todo lo escrito para volver a enviarlo (ver sección 9).

### 7.8 Editar y consultar
- [ ] Una evaluación registrada se puede editar hasta 10 días después de terminado el evento; el formulario lo indica («Puedes editar esta evaluación hasta el ‹fecha›»).
- [ ] Fuera del plazo se abre en solo lectura, con el aviso «Evaluación registrada · solo lectura», sin «Cancelar» y con «Volver al perfil» en lugar de «Guardar evaluación».

## 8. Avisos
- [ ] Los avisos llegan a la campana con un contador de no leídos.
- [ ] La campana abre un panel con los avisos; al tocar uno lleva a la pantalla correspondiente y deja de contarse como no leído.

## 9. Carga, error y vacío
- [ ] **Cargando:** Mis eventos, el detalle del evento, el perfil del deportista y el perfil del metodólogo muestran un esqueleto con la forma de la pantalla mientras llegan los datos.
- [ ] **Error:** si no se pueden cargar los datos, la pantalla dice qué no se pudo cargar y ofrece «Reintentar».
- [ ] **Sin conexión:** se informa que no hay conexión y se ofrece «Reintentar».
- [ ] **Vacío:** cada pantalla tiene su mensaje cuando no hay datos, por ejemplo «Aún no tienes eventos asignados».
- [ ] **Fallo al enviar una evaluación:** se muestra un aviso de error y el formulario conserva todo lo escrito para volver a enviarlo.

---

## Para cerrar la tarea
- [ ] El COC revisó la propuesta y confirmó el caso de uso; sus observaciones quedan en PROD-65.
- [ ] Desarrollo confirma la viabilidad y el esfuerzo, si web y celular comparten los datos, y el rol y los permisos del metodólogo en la web.
- [ ] Hay una recomendación escrita (hacer, no hacer o posponer) y, si se hace, las tareas de diseño y desarrollo vinculadas.
