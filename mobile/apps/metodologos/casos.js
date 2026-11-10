/* Pasos: goto (sin url va a «inicio»), click (sel), note (sel opcional). Con ?dev=1 el botón «Elegir elemento» te da el selector.
   Un caso por flujo del inventario (docs/inventario.md). Ninguno puede teclear: el marco solo pulsa y resalta. */
window.CASOS = [
  { id: "1.1", titulo: "Iniciar sesión", falta: "El inicio de sesión real pasa por Keycloak y valida correo y contraseña; aquí «Iniciar sesión» entra con un usuario fijo sin pedir datos. «Recuperar» y los textos legales solo avisan.",
    steps: [
      { t: "goto", body: "La app arranca en el login." },
      { t: "note", sel: "[data-testid=\"login-ingresar\"]", body: "Se ingresa con la cuenta del Comité Olímpico Colombiano." },
      { t: "click", sel: "[data-testid=\"login-ingresar\"]", body: "Pulsamos «Ingresar»: se abre el inicio de sesión." },
      { t: "note", sel: "[data-testid=\"iniciar-sesion-form\"]", body: "Aquí iría el correo y la contraseña; en la demo no hace falta escribir nada." },
      { t: "click", sel: "[data-testid=\"iniciar-sesion-enviar\"]", body: "Pulsamos «Iniciar sesión»: entra con la sesión de mentira." },
      { t: "note", sel: "[data-testid=\"eventos-lista\"]", body: "Llegamos a los eventos asignados." }
    ] },
  { id: "1.2", titulo: "Filtrar eventos por estado", falta: "La búsqueda por texto no se puede escribir desde un caso; funciona al teclear en la app.",
    steps: [
      { t: "goto", url: "index.html?sesion=1#/eventos", body: "Empezamos en el inicio, con la sesión ya iniciada." },
      { t: "click", sel: "[data-testid=\"eventos-filtro-estado\"]", body: "Abrimos el filtro «Estado»." },
      { t: "click", sel: "[data-testid=\"estado-opcion-finalizado\"]", body: "Elegimos «Finalizado»." },
      { t: "click", sel: "[data-testid=\"estado-aplicar\"]", body: "Aplicamos el filtro." },
      { t: "note", sel: "[data-testid=\"eventos-lista\"]", body: "Solo quedan los eventos finalizados, con su aviso de plazo de edición." }
    ] },
  { id: "1.3", titulo: "Abrir «Conoce más»", falta: "«Visítanos» abre la landing en la app real; aquí solo avisa.",
    steps: [
      { t: "goto", url: "index.html?sesion=1#/eventos", body: "Empezamos en el inicio, con la sesión ya iniciada." },
      { t: "click", sel: "[data-testid=\"appbar-menu\"]", body: "Pulsamos el menú." },
      { t: "note", sel: "[data-testid=\"conoce-mas-visitanos\"]", body: "El panel «Conoce más» entra por la derecha." }
    ] },
  { id: "2.1", titulo: "Abrir un evento y filtrar deportistas", falta: "La búsqueda por nombre no se puede escribir desde un caso; el filtro por deporte (lista desplegable) tampoco se recorre aquí.",
    steps: [
      { t: "goto", url: "index.html?sesion=1#/eventos", body: "Empezamos en el inicio, con la sesión ya iniciada." },
      { t: "click", sel: "[data-testid=\"evento-card-e1\"]", body: "Abrimos el evento en curso." },
      { t: "note", sel: "[data-testid=\"evento-deportes-calificar\"]", body: "Arriba, una fila resume los deportes que el metodólogo debe calificar en este evento: cuántos son y cuáles." },
      { t: "note", sel: "[data-testid=\"evento-lista\"]", body: "Esta es la lista de deportistas inscritos." },
      { t: "click", sel: "[data-testid=\"evento-filtro\"]", body: "Abrimos el filtro de deportistas." },
      { t: "click", sel: "[data-testid=\"filtro-estado-calificado\"]", body: "Elegimos el estado «Calificado»." },
      { t: "click", sel: "[data-testid=\"filtro-genero-mujer\"]", body: "Y el género «Mujer»." },
      { t: "click", sel: "[data-testid=\"filtro-aplicar\"]", body: "Pulsamos «Aplicar»." },
      { t: "note", sel: "[data-testid=\"evento-filtro-badge\"]", body: "El botón de filtro muestra cuántos filtros hay activos." },
      { t: "note", sel: "[data-testid=\"evento-lista\"]", body: "Solo queda la deportista que cumple ambos filtros." }
    ] },
  { id: "2.2", titulo: "Limpiar los filtros de deportistas", falta: "La lista desplegable de deporte del filtro no se recorre aquí.",
    steps: [
      { t: "goto", url: "index.html?sesion=1#/eventos", body: "Empezamos en el inicio, con la sesión ya iniciada." },
      { t: "click", sel: "[data-testid=\"evento-card-e1\"]", body: "Abrimos el evento en curso." },
      { t: "click", sel: "[data-testid=\"evento-filtro\"]", body: "Abrimos el filtro." },
      { t: "click", sel: "[data-testid=\"filtro-genero-hombre\"]", body: "Elegimos el género «Hombre»." },
      { t: "click", sel: "[data-testid=\"filtro-aplicar\"]", body: "Aplicamos." },
      { t: "note", sel: "[data-testid=\"evento-lista\"]", body: "La lista se reduce a los deportistas hombres." },
      { t: "click", sel: "[data-testid=\"evento-filtro\"]", body: "Volvemos a abrir el filtro: conserva la selección." },
      { t: "click", sel: "[data-testid=\"filtro-limpiar\"]", body: "«Limpiar» desmarca todo." },
      { t: "click", sel: "[data-testid=\"filtro-aplicar\"]", body: "Aplicamos sin filtros." },
      { t: "note", sel: "[data-testid=\"evento-lista\"]", body: "La lista vuelve a mostrar todos los deportistas." }
    ] },
  { id: "2.3", titulo: "Deportes individuales y de conjunto", falta: "La búsqueda por nombre no se puede escribir desde un caso.",
    steps: [
      { t: "goto", url: "index.html?sesion=1#/eventos", body: "Empezamos en el inicio, con la sesión ya iniciada." },
      { t: "click", sel: "[data-testid=\"evento-card-e1\"]", body: "Abrimos el evento en curso." },
      { t: "note", sel: "[data-testid=\"evento-tabs\"]", body: "El evento separa los deportes en dos pestañas." },
      { t: "note", sel: "[data-testid=\"evento-lista\"]", body: "«Deportes individuales»: una fila por deportista." },
      { t: "click", sel: "[data-testid=\"evento-tab-conjunto\"]", body: "Pasamos a «Deportes de conjunto»." },
      { t: "note", sel: "[data-testid=\"evento-lista\"]", body: "Aquí cada fila es un equipo." },
      { t: "click", sel: "[data-testid=\"evento-tab-individuales\"]", body: "Volvemos a los individuales." },
      { t: "note", sel: "[data-testid=\"evento-lista\"]", body: "Se listan de nuevo los deportistas." }
    ] },
  { id: "2.4", titulo: "Ver los deportes a calificar", falta: "La hoja es informativa: no se puede filtrar ni elegir un deporte desde ahí.",
    steps: [
      { t: "goto", url: "index.html?sesion=1#/eventos", body: "Empezamos en el inicio, con la sesión ya iniciada." },
      { t: "click", sel: "[data-testid=\"evento-card-e1\"]", body: "Abrimos el evento en curso." },
      { t: "click", sel: "[data-testid=\"evento-deportes-calificar\"]", body: "Pulsamos la fila de deportes a calificar." },
      { t: "note", sel: "[data-testid=\"deportes-sheet-lista\"]", body: "Se abre la hoja con todos los deportes asignados." }
    ] },
  { id: "2.5", titulo: "Ver mis atletas en un evento programado", falta: "Solo se recorre el evento programado de Dakar; los datos de atletas y equipos son de muestra.",
    steps: [
      { t: "goto", url: "index.html?sesion=1#/eventos", body: "Caso: al metodólogo le salían 0 atletas en un evento programado aunque tuviera boxeo, lucha y esgrima asignados. Ahora los ve. Empezamos en el inicio, con la sesión iniciada." },
      { t: "note", sel: "[data-testid=\"evento-card-e5\"]", body: "Los Juegos Olímpicos de la Juventud Dakar 2026 están «Programado»: el evento aún no empieza." },
      { t: "click", sel: "[data-testid=\"evento-card-e5\"]", body: "Abrimos el evento programado." },
      { t: "note", sel: "[data-testid=\"evento-deportes-calificar\"]", body: "Una sola fila resume los 5 deportes asignados al metodólogo: boxeo, lucha, esgrima, baloncesto y rugby." },
      { t: "note", sel: "[data-testid=\"evento-lista\"]", body: "Y la lista con sus 6 atletas asignados, aunque el evento esté programado." },
      { t: "click", sel: "[data-testid=\"deportista-tile-d6\"]", body: "Abrimos a uno de ellos." },
      { t: "note", sel: "[data-testid=\"perfil-tabs\"]", body: "Se ve su perfil, con «Calificar» e «Historial»." },
      { t: "note", sel: "[data-testid=\"perfil-bloqueado-0\"]", body: "Pero la prueba no se puede calificar todavía: en vez de «Iniciar formulario» dice «No se puede calificar» y el motivo, «El evento aún no inicia»." },
      { t: "click", sel: "[data-testid=\"perfil-volver\"]", body: "Volvemos al evento." },
      { t: "click", sel: "[data-testid=\"evento-tab-conjunto\"]", body: "Pasamos a los deportes de conjunto del evento programado." },
      { t: "note", sel: "[data-testid=\"evento-lista\"]", body: "También se ven los equipos asignados: baloncesto 3x3 y rugby 7." },
      { t: "click", sel: "[data-testid=\"deportista-tile-c4\"]", body: "Abrimos la selección de Baloncesto 3x3." },
      { t: "note", sel: "[data-testid=\"perfil-bloqueado-equipo\"]", body: "El equipo tampoco se puede calificar todavía: en vez de «Calificar en conjunto» dice «El evento aún no inicia»." }
    ] },
  { id: "3.1", titulo: "Abrir el perfil de un deportista", falta: "Solo se muestra una deportista con la prueba sin calificar; el perfil con pruebas calificadas está en 4.3.",
    steps: [
      { t: "goto", url: "index.html?sesion=1#/eventos", body: "Empezamos en el inicio, con la sesión ya iniciada." },
      { t: "click", sel: "[data-testid=\"evento-card-e1\"]", body: "Abrimos el evento en curso." },
      { t: "click", sel: "[data-testid=\"deportista-tile-d2\"]", body: "Abrimos a Valentina Ríos." },
      { t: "note", sel: "[data-testid=\"perfil-titulo\"]", body: "«Perfil del deportista»." },
      { t: "note", sel: "[data-testid=\"perfil-info\"]", body: "Su información deportiva y su estado." },
      { t: "note", sel: "[data-testid=\"perfil-prueba-0\"]", body: "Cada prueba tiene su tarjeta con «Iniciar formulario»." },
      { t: "click", sel: "[data-testid=\"perfil-volver\"]", body: "Volvemos al evento." },
      { t: "note", sel: "[data-testid=\"evento-lista\"]", body: "De vuelta en la lista de deportistas." }
    ] },
  { id: "3.2", titulo: "Perfil del deporte e integrante del equipo", falta: "No se recorren el equipo ya calificado ni un equipo sin integrantes.",
    steps: [
      { t: "goto", url: "index.html?sesion=1#/eventos", body: "Empezamos en el inicio, con la sesión ya iniciada." },
      { t: "click", sel: "[data-testid=\"evento-card-e1\"]", body: "Abrimos el evento en curso." },
      { t: "click", sel: "[data-testid=\"evento-tab-conjunto\"]", body: "Vamos a los deportes de conjunto." },
      { t: "click", sel: "[data-testid=\"deportista-tile-c1\"]", body: "Abrimos la selección de Baloncesto." },
      { t: "note", sel: "[data-testid=\"perfil-titulo\"]", body: "«Perfil del deporte»: la calificación es del equipo." },
      { t: "note", sel: "[data-testid=\"perfil-integrantes-nota\"]", body: "Los integrantes son solo informativos." },
      { t: "click", sel: "[data-testid=\"perfil-integrante-c1-m1\"]", body: "Abrimos a una integrante." },
      { t: "note", sel: "[data-testid=\"perfil-aviso-miembro\"]", body: "No se califica por separado: se califica con el equipo." }
    ] },
  { id: "3.3", titulo: "Descarga de historial del atleta", falta: "El Excel se arma en el navegador con datos de muestra; en la app real lo pediría al servicio. La muestra tiene un solo deportista con evaluaciones en varios eventos (Javier Manríquez).",
    steps: [
      { t: "goto", url: "index.html?sesion=1#/eventos", body: "Historia: como metodólogo quiero ver y descargar todas las evaluaciones cualitativas que se le han hecho a un deportista a lo largo de los eventos del ciclo. Empezamos en el inicio, con la sesión iniciada." },
      { t: "click", sel: "[data-testid=\"evento-card-e1\"]", body: "Abrimos el evento en curso." },
      { t: "click", sel: "[data-testid=\"deportista-tile-d1\"]", body: "Abrimos a Javier Manríquez." },
      { t: "note", sel: "[data-testid=\"perfil-tabs\"]", body: "El perfil tiene dos pestañas: «Calificar» (lo pendiente de este evento) e «Historial»." },
      { t: "click", sel: "[data-testid=\"perfil-tab-historial\"]", body: "Abrimos el «Historial»." },
      { t: "note", sel: "[data-testid=\"perfil-historial-lista\"]", body: "Están todas las evaluaciones completadas, de todos los eventos del ciclo, agrupadas por evento y sea cual sea su estado." },
      { t: "note", sel: "[data-testid=\"perfil-plazo-3\"]", body: "Una sola acción por evaluación: el lápiz mientras el plazo sigue abierto (aquí lo indica el texto) y el ojo, en solo lectura, cuando ya no se puede editar." },
      { t: "click", sel: "[data-testid=\"perfil-descargar-historial\"]", body: "Pulsamos «Descargar historial»: se genera un Excel con una fila por evaluación (evento, prueba, fecha, evaluador, plazo y los aspectos técnico, táctico y físico, conclusiones y recomendaciones)." },
      { t: "note", sel: "[data-testid=\"snackbar\"]", body: "El navegador descarga el archivo y la app lo confirma con un aviso abajo." },
      { t: "click", sel: "[data-testid=\"perfil-ver-4\"]", body: "Abrimos una evaluación de un evento finalizado, cuyo plazo de edición ya terminó." },
      { t: "note", sel: "[data-testid=\"evaluacion-aviso-plazo\"]", body: "El formulario queda en solo lectura y lo explica: el plazo de edición terminó." }
    ] },
  { id: "3.4", titulo: "Descarga de historial del atleta: deporte de conjunto", falta: "La evaluación es del equipo: desde el perfil del integrante solo se ve y se descarga, no se edita. La edición se hace en el perfil del deporte y solo mientras el plazo siga abierto.",
    steps: [
      { t: "goto", url: "index.html?sesion=1#/eventos", body: "Mismo historial, ahora en un deporte de conjunto. Empezamos en el inicio, con la sesión iniciada." },
      { t: "click", sel: "[data-testid=\"evento-card-e1\"]", body: "Abrimos el evento en curso." },
      { t: "click", sel: "[data-testid=\"evento-tab-conjunto\"]", body: "Vamos a los deportes de conjunto." },
      { t: "click", sel: "[data-testid=\"deportista-tile-c2\"]", body: "Abrimos la selección de Voleibol." },
      { t: "click", sel: "[data-testid=\"perfil-integrante-c2-m1\"]", body: "Abrimos a una integrante." },
      { t: "note", sel: "[data-testid=\"perfil-aviso-miembro\"]", body: "Sigue el aviso: se califica con el equipo, no por separado." },
      { t: "note", sel: "[data-testid=\"perfil-historial-lista\"]", body: "Debajo está el historial de evaluaciones del equipo, de todos los eventos." },
      { t: "note", sel: "[data-testid=\"perfil-plazo-0\"]", body: "Si la evaluación aún se puede editar, la card lo dice y manda a hacerlo desde el perfil del deporte. Si el plazo cerró, no dice nada." },
      { t: "click", sel: "[data-testid=\"perfil-ver-0\"]", body: "Desde aquí solo se puede ver la evaluación." },
      { t: "note", sel: "[data-testid=\"evaluacion-banner-solo-lectura\"]", body: "El formulario queda en solo lectura." },
      { t: "click", sel: "[data-testid=\"evaluacion-volver-perfil\"]", body: "Volvemos al perfil del integrante." },
      { t: "click", sel: "[data-testid=\"perfil-descargar-historial\"]", body: "«Descargar historial» baja el Excel con las evaluaciones del equipo." }
    ] },
  { id: "4.1", titulo: "Calificar una prueba individual: errores de validación", falta: "El marco solo pulsa: no se puede escribir en los campos, así que no se llega a «Confirmar envío» ni a que la prueba quede «Calificado». En la app se escribe y se confirma.",
    steps: [
      { t: "goto", url: "index.html?sesion=1#/eventos", body: "Empezamos en el inicio, con la sesión ya iniciada." },
      { t: "click", sel: "[data-testid=\"evento-card-e1\"]", body: "Abrimos el evento en curso." },
      { t: "click", sel: "[data-testid=\"deportista-tile-d2\"]", body: "Abrimos a Valentina Ríos." },
      { t: "click", sel: "[data-testid=\"perfil-iniciar-0\"]", body: "«Iniciar formulario» de la prueba 50m libre." },
      { t: "note", sel: "[data-testid=\"evaluacion-seccion-1\"]", body: "Los datos del deportista vienen precargados y bloqueados." },
      { t: "note", sel: "[data-testid=\"evaluacion-seccion-3\"]", body: "Los campos de evaluación están vacíos." },
      { t: "click", sel: "[data-testid=\"evaluacion-guardar\"]", body: "Pulsamos «Guardar evaluación» sin escribir nada." },
      { t: "note", sel: "[data-testid=\"evaluacion-campo-athletesCount\"]", body: "Cada campo obligatorio marca su error." },
      { t: "note", sel: "[data-testid=\"snackbar\"]", body: "Y aparece el aviso para revisar los campos." }
    ] },
  { id: "4.2", titulo: "Calificar un deporte de conjunto", falta: "Tampoco se puede escribir: queda sin recorrer el llenado y la confirmación.",
    steps: [
      { t: "goto", url: "index.html?sesion=1#/eventos", body: "Empezamos en el inicio, con la sesión ya iniciada." },
      { t: "click", sel: "[data-testid=\"evento-card-e1\"]", body: "Abrimos el evento en curso." },
      { t: "click", sel: "[data-testid=\"evento-tab-conjunto\"]", body: "Vamos a los deportes de conjunto." },
      { t: "click", sel: "[data-testid=\"deportista-tile-c1\"]", body: "Abrimos la selección de Baloncesto." },
      { t: "click", sel: "[data-testid=\"perfil-calificar-conjunto\"]", body: "Pulsamos «Calificar en conjunto»." },
      { t: "note", sel: "[data-testid=\"evaluacion-campo-delegacion\"]", body: "El formulario del equipo muestra la delegación o institución." },
      { t: "click", sel: "[data-testid=\"evaluacion-guardar\"]", body: "Probamos «Guardar evaluación» vacío." },
      { t: "note", sel: "[data-testid=\"evaluacion-campo-technicalAspect\"]", body: "Los mismos campos obligatorios marcan error." }
    ] },
  { id: "4.3", titulo: "Ver una evaluación en solo lectura", falta: "La edición dentro del plazo no se recorre: ninguna prueba de los datos fijos es editable.",
    steps: [
      { t: "goto", url: "index.html?sesion=1#/eventos", body: "Empezamos en el inicio, con la sesión ya iniciada." },
      { t: "click", sel: "[data-testid=\"evento-card-e1\"]", body: "Abrimos el evento en curso." },
      { t: "click", sel: "[data-testid=\"deportista-tile-d1\"]", body: "Abrimos a Javier Manríquez." },
      { t: "click", sel: "[data-testid=\"perfil-tab-historial\"]", body: "Las evaluaciones completadas están en la pestaña «Historial»." },
      { t: "note", sel: "[data-testid=\"perfil-prueba-0\"]", body: "Su prueba «100m planos» ya está calificada." },
      { t: "click", sel: "[data-testid=\"perfil-ver-0\"]", body: "Pulsamos el ojo para ver la evaluación." },
      { t: "note", sel: "[data-testid=\"evaluacion-banner-solo-lectura\"]", body: "El formulario queda en solo lectura." },
      { t: "click", sel: "[data-testid=\"evaluacion-volver-perfil\"]", body: "«Volver al perfil»." },
      { t: "note", sel: "[data-testid=\"perfil-tabs\"]", body: "De vuelta en el perfil del deportista." }
    ] },
  { id: "5.1", titulo: "Mi perfil y cerrar sesión", falta: "Cerrar sesión aquí solo limpia la sesión en memoria; el login real pasa por Keycloak.",
    steps: [
      { t: "goto", url: "index.html?sesion=1#/eventos", body: "Empezamos en el inicio, con la sesión ya iniciada." },
      { t: "click", sel: "[data-testid=\"nav-perfil\"]", body: "Abrimos la pestaña «Mi perfil»." },
      { t: "note", sel: "[data-testid=\"perfil-info-personal\"]", body: "Nombre, rol y correo del metodólogo." },
      { t: "click", sel: "[data-testid=\"perfil-cerrar-sesion\"]", body: "Pulsamos «Cerrar sesión»." },
      { t: "note", sel: "[data-testid=\"login-ingresar\"]", body: "Volvemos al login." }
    ] },
  { id: "6.1", titulo: "Aviso: tu deportista va a competir", falta: "Los avisos son simulados: no hay notificaciones push reales ni reloj del evento. El celular marca siempre la misma hora.",
    steps: [
      { t: "goto", url: "index.html#/celular?ntf=compite", body: "Alerta automática. Es el inicio del celular del metodólogo, con la app instalada y cerrada. Faltan 30 minutos para la prueba de una deportista que tiene asignada." },
      { t: "note", sel: "[data-testid=\"notif-banner\"]", body: "30 minutos antes llega el aviso: «Valentina Ríos compite pronto». Recuerda calificarla cuando termine. La insignia usa el tema «precaución» del SDK." },
      { t: "note", sel: "[data-testid=\"celular-insignia\"]", body: "Y la app muestra una insignia con la cantidad de avisos pendientes." },
      { t: "click", sel: "[data-testid=\"notif-banner\"]", body: "Al tocar el aviso se abre la app directo en el perfil de la deportista." },
      { t: "note", sel: "[data-testid=\"perfil-prueba-0\"]", body: "Ahí está su prueba, lista para calificar cuando termine." }
    ] },
  { id: "6.2", titulo: "Aviso: tu deportista terminó su prueba", falta: "Los avisos son simulados: no hay notificaciones push reales ni reloj del evento. El celular marca siempre la misma hora; en la app real sería la hora en que termina la prueba.",
    steps: [
      { t: "goto", url: "index.html#/celular?ntf=termino", body: "Alerta automática. Inicio del celular del metodólogo: la prueba de su deportista acaba de terminar y aún no la ha calificado." },
      { t: "note", sel: "[data-testid=\"notif-banner\"]", body: "Cuando termina llega el aviso: «Valentina Ríos terminó su prueba». Pide calificarla para que quede en el historial. La insignia usa el tema «informativo» del SDK." },
      { t: "click", sel: "[data-testid=\"notif-banner\"]", body: "Al tocarlo se abre la app en el perfil de la deportista." },
      { t: "note", sel: "[data-testid=\"perfil-iniciar-0\"]", body: "Desde ahí inicia el formulario de la prueba que terminó." }
    ] },
  { id: "6.3", titulo: "Aviso al gestor del comité: evaluación recibida", falta: "El gestor trabaja en la plataforma web, que la demo no incluye: el aviso solo informa y al tocarlo se explica eso. Aquí se ve en un celular para mostrar el mismo patrón de aviso.",
    steps: [
      { t: "goto", url: "index.html#/celular?ntf=recibida", body: "Alerta automática para otro actor: el gestor del comité. Un metodólogo acaba de registrar una evaluación en la plataforma." },
      { t: "note", sel: "[data-testid=\"notif-banner\"]", body: "Al registrarse la evaluación llega el aviso: «Nueva evaluación recibida», con quién la calificó, a qué deportista y en qué evento. La insignia usa el tema «positivo» del SDK." },
      { t: "click", sel: "[data-testid=\"notif-banner\"]", body: "Al tocarlo, en la plataforma web se abriría la evaluación recibida." },
      { t: "note", sel: "[data-testid=\"snackbar\"]", body: "En la demo no hay plataforma web: la app avisa que ese paso se hace allá." }
    ] },
  { id: "6.4", titulo: "Bandeja de notificaciones", falta: "Solo es la bandeja: no hay preferencias para elegir cuándo avisar ni silenciar por evento. Los avisos son de muestra y el estado de lectura se pierde al recargar.",
    steps: [
      { t: "goto", url: "index.html?sesion=1#/eventos", body: "Los avisos automáticos también quedan guardados dentro de la app. Empezamos en el inicio, con la sesión iniciada." },
      { t: "note", sel: "[data-testid=\"appbar-notificaciones\"]", body: "La campana de la barra superior cuenta los avisos que aún no se han leído." },
      { t: "click", sel: "[data-testid=\"appbar-notificaciones\"]", body: "Abrimos la bandeja de notificaciones." },
      { t: "note", sel: "[data-testid=\"notificaciones-tabs\"]", body: "Dos pestañas: «Recientes», con la cantidad de avisos nuevos, y «Todas», con el total." },
      { t: "note", sel: "[data-testid=\"notificaciones-lista\"]", body: "En «Recientes» están los avisos de hoy: los nuevos llevan un punto y fondo suave. Cada uno dice qué deportista, qué prueba y de qué evento." },
      { t: "click", sel: "[data-testid=\"notificaciones-tab-todas\"]", body: "Abrimos «Todas»." },
      { t: "note", sel: "[data-testid=\"notificaciones-lista\"]", body: "Aquí están todos los avisos: los de hoy y los de días anteriores, ya leídos." },
      { t: "click", sel: "[data-testid=\"notificaciones-tab-recientes\"]", body: "Volvemos a «Recientes»." },
      { t: "click", sel: "[data-testid=\"notificacion-n2\"]", body: "Tocamos «Valentina Ríos compite pronto»: lleva al perfil de la deportista." },
      { t: "note", sel: "[data-testid=\"perfil-prueba-0\"]", body: "Ahí está su prueba, lista para calificar." },
      { t: "note", sel: "[data-testid=\"campana-insignia\"]", body: "Y el aviso quedó leído: la campana cuenta uno menos." }
    ] }
];
