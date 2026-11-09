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
      { t: "note", sel: "[data-testid=\"evento-deportes-calificar\"]", body: "Arriba están los deportes que el metodólogo debe calificar en este evento." },
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
  { id: "2.4", titulo: "Ver los deportes a calificar", falta: "El «+N» de las pastillas abre la misma hoja y no se recorre aparte.",
    steps: [
      { t: "goto", url: "index.html?sesion=1#/eventos", body: "Empezamos en el inicio, con la sesión ya iniciada." },
      { t: "click", sel: "[data-testid=\"evento-card-e1\"]", body: "Abrimos el evento en curso." },
      { t: "click", sel: "[data-testid=\"evento-deportes-info\"]", body: "Pulsamos el icono de información." },
      { t: "note", sel: "[data-testid=\"deportes-sheet-lista\"]", body: "Se abre la hoja con todos los deportes asignados." }
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
      { t: "note", sel: "[data-testid=\"perfil-prueba-0\"]", body: "Su prueba «100m planos» ya está calificada." },
      { t: "click", sel: "[data-testid=\"perfil-ver-0\"]", body: "Pulsamos el ojo para ver la evaluación." },
      { t: "note", sel: "[data-testid=\"evaluacion-banner-solo-lectura\"]", body: "El formulario queda en solo lectura." },
      { t: "click", sel: "[data-testid=\"evaluacion-volver-perfil\"]", body: "«Volver al perfil»." },
      { t: "note", sel: "[data-testid=\"perfil-prueba-0\"]", body: "De vuelta en el perfil." }
    ] },
  { id: "5.1", titulo: "Mi perfil y cerrar sesión", falta: "Cerrar sesión aquí solo limpia la sesión en memoria; el login real pasa por Keycloak.",
    steps: [
      { t: "goto", url: "index.html?sesion=1#/eventos", body: "Empezamos en el inicio, con la sesión ya iniciada." },
      { t: "click", sel: "[data-testid=\"nav-perfil\"]", body: "Abrimos la pestaña «Mi perfil»." },
      { t: "note", sel: "[data-testid=\"perfil-info-personal\"]", body: "Nombre, rol y correo del metodólogo." },
      { t: "click", sel: "[data-testid=\"perfil-cerrar-sesion\"]", body: "Pulsamos «Cerrar sesión»." },
      { t: "note", sel: "[data-testid=\"login-ingresar\"]", body: "Volvemos al login." }
    ] }
];
