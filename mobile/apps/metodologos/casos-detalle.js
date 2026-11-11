/* Detalle de cada caso guiado para quien replica la app en Flutter (diseño, desarrollo, QA). Las claves son los ids de casos.js.
   Medidas y tokens salen del CSS de la demo; lo que no se pudo confirmar sin el repo Flutter va en «Pendiente». */
window.CASOS_DETALLE = {
  "1.1": {
    resumen: "La app abre con el splash «Noche olímpica» del Ciclo Olímpico. El splash se convierte en el formulario de inicio de sesión sin cambiar de pantalla, y «Iniciar sesión» entra a Eventos con un usuario fijo.",
    secciones: [
      { titulo: "Qué cambió", items: [
        "Antes eran dos pantallas: `#/login` (portada de `login_page.dart`) y `#/iniciar-sesion`, que imitaba el WebView de Keycloak (`auth_webview_page.dart`) con la barra «‹ Iniciar sesión» y «¡Bienvenido de vuelta!». Ahora queda una sola ruta, `#/login`, donde el splash se transforma en el formulario. Se borraron `js/screens/iniciar-sesion.js` y `css/screens/iniciar-sesion.css`.",
        "Al llegar al formulario el fondo pasa de navy (degradado `blue-jic-900` → `blue-jic-700`) a un blanco cálido `#FFFDF9`. El logo del COC no salta a otra pantalla: sube y se encoge hasta la cabecera (escala 1.3 → 0.68).",
        "Sobre el fondo navy, la palabra COLOMBIA y el aro negro del logo se pintan en blanco con un filtro; en la fase de formulario recuperan su color.",
        "El splash se ve una sola vez por arranque. Al cerrar sesión (caso 5.1) se vuelve directo al formulario."
      ] },
      { titulo: "Qué se agregó", items: [
        "Extra de la demo, el splash «Noche olímpica»: órbitas concéntricas en SVG (trazo `#DFB550`, opacidad .42), el nombre «Ciclo Olímpico» a 58 px, una regla amarilla, el rótulo «PARA METODÓLOGOS», el logo de MinDeporte en blanco y una barra de carga amarilla.",
        "Logo del COC armado por capas (`assets/images/coc_logo_wave.png`, `coc_logo_l0…l7.png`, `coc_logo_r0…r4.png`). Primero se dibuja la ola, después cada letra de COLOMBIA sube de forma escalonada y cada aro aparece con un «pop».",
        "Botón de ojo para mostrar u ocultar la contraseña. Cambia el icono, `aria-pressed` y la etiqueta accesible.",
        "«Recuperar», «Política de tratamiento de datos» y «Términos y condiciones» solo muestran el toast «Próximamente» del SDK (`NwtToast`, tema informative)."
      ] },
      { titulo: "Qué se mejoró", items: [
        "Si el sistema tiene «reducir movimiento» (`prefers-reduced-motion`), no se muestra el splash: la app arranca en el formulario y sin transiciones.",
        "El asterisco de obligatorio pasa a `error-700` (5.07:1 sobre blanco). Los enlaces tienen un área táctil mínima de 44 px."
      ] },
      { titulo: "Cómo se hace", items: [
        "La pantalla tiene una fase de estado `idle → splash → login` (un enum). Todo es un solo `Stack` a pantalla completa. Cada capa (fondo, órbitas, logo, nombre, cabecera, formulario, pie, MinDeporte, barra de carga) es un `AnimatedPositioned`, `AnimatedOpacity` o `AnimatedScale` que reacciona al cambio de fase.",
        "Al montar la pantalla: a los 80 ms pasa a `splash` y a los 3000 ms a `login`. Un flag `splashVisto` en memoria evita repetir el splash dentro del mismo arranque.",
        "Si el sistema pide menos movimiento (`MediaQuery.disableAnimations`), se arranca directo en `login` sin animaciones.",
        "Datos reales: el login pasa por Keycloak (WebView) y después `/me` devuelve el usuario y sus roles. La demo usa en su lugar `Session.login()` con el usuario fijo de `coc_sample.dart`: Juan José Pérez Granados, Metodólogo, rusbel.pinto@gmail.com.",
        "Con sesión iniciada, el guard (`app_router.dart::_guard`) manda a Eventos. Sin sesión, cualquier ruta redirige a login.",
        "La versión con splash vive en `js/screens/login.js` y `css/screens/login.css`."
      ] },
      { titulo: "Spec Flutter", items: [
        "Origen en la app: `lib/features/auth/.../login_page.dart`, `auth_webview_page.dart`, el splash `oc_splash_page.dart` y `boot_gate.dart`. La demo reemplaza los dos últimos por esta animación.",
        "Fondo del splash: `LinearGradient` vertical de `blue-jic-900` `#181E47` a `blue-jic-700` `#293377`. Fondo del formulario: `#FFFDF9`, un literal de la demo que no es token.",
        "Paso de una fase a otra: 1100 ms con la curva `Cubic(0.32, 0.72, 0, 1)`. El formulario y el pie entran desde `translateY(40)` con opacidad, con retrasos de 120 ms y 220 ms.",
        "Logo: caja de 200×200 centrada en `top: 19%` con escala 1.3. En la fase de formulario queda en `top: 40` con escala 0.68 (origen arriba al centro).",
        "Ola: se revela con un recorte de izquierda a derecha en 800 ms, `Cubic(.42,0,.58,1)`, con 150 ms de retraso. Letras: opacidad + `translateY(8)` en 520 ms, `Cubic(.22,.61,.36,1)`, con retraso de `650 + 55·k` ms. Aros: escala .3 → 1 con la curva de rebote `Cubic(.175,.885,.32,1.275)` y retraso de `1150 + 120·k` ms.",
        "Nombre del splash: 58 px bold, interletrado −0.035em, blanco. Debajo, una regla de 56×3 con radio 2 en `yellow-jic-500` `#DFB550` y un rótulo de 12 px bold con interletrado .3em, en mayúsculas y `yellow-jic-400` `#E5C473`. En la fase de formulario el nombre sube a `top: 28%`, se escala a .45 y se desvanece.",
        "Cabecera del formulario: «Ciclo Olímpico» a 28 px bold navy (`--fs-h1`) y «PARA METODÓLOGOS» a 11 px bold, interletrado .3em, en `yellow-jic-800` `#7A662A`. Va a 194 px del borde superior.",
        "Formulario: márgenes laterales de 24 (`spacingsMedium.XL`), anclado a 150 px del borde inferior. Etiqueta: 15 px bold `gray-900`, con el `*` en `error-700` `#DA1630`. Campo: 52 de alto, radio 12, borde de 1 en `gray-400`, padding horizontal 16 y texto de 16 px. Con foco, el borde pasa a 2 en `orange-700` `#D74009`. El ojo va en una caja táctil de 44, a 4 px del borde.",
        "«¿Olvidaste la contraseña? Recuperar»: 14 px `gray-700`, alineado a la derecha; «Recuperar» va en bold `gray-900`.",
        "Botón «Iniciar sesión»: `OcButton` variante dark (fondo `#282834`, texto blanco), 52 de alto, radio 12, texto 16/700. Textos legales a 12 px `gray-700` con enlaces en `#4850E5` (`--link`).",
        "Barra de carga: 4 px de alto, radio 2, fondo `white-alpha-20` y relleno `yellow-jic-400` que crece con `scaleX 0 → 1` en 2800 ms (`Cubic(.22,.9,.35,1)`). El logo de MinDeporte mide 80 de ancho, va en blanco y a 70 px del borde inferior. Las dos piezas solo se ven durante el splash.",
        "Tipografía: la demo usa Google Sans (`--font`). Ver «Pendiente»."
      ] },
      { titulo: "Pendiente", items: [
        "De casos.js: el inicio de sesión real pasa por Keycloak y valida correo y contraseña; aquí «Iniciar sesión» entra con un usuario fijo sin pedir datos. «Recuperar» y los textos legales solo muestran un aviso.",
        "Decisión de producto: el splash animado ¿reemplaza al splash/BootGate actual o se suma a él? El de la app valida la sesión y precarga los eventos, y los 3 s de la animación tendrían que cubrir esa carga.",
        "Decisión técnica: ¿el formulario nativo reemplaza el WebView de Keycloak? Eso exige un flujo de login directo contra el backend. La otra opción es que la animación solo lleve hasta el WebView.",
        "El aviso «Tu sesión expiró» (snackbar del inventario) no tiene caso.",
        "Hay que confirmar en el repo Flutter la tipografía real: `tokens.css` declara Helvetica («Guía COC»), pero la demo usa Google Sans."
      ] }
    ]
  },

  "1.2": {
    resumen: "En Eventos, el metodólogo abre el filtro «Estado», marca «Finalizado» y aplica. Solo quedan los eventos finalizados, cada uno con su aviso de plazo de edición.",
    secciones: [
      { titulo: "Qué cambió", items: [
        "La lista ahora va sobre un lienzo `gray-100` (`.page-body.tonal`). Las tarjetas de evento pasan de tener borde `gray-300` a ser blancas, sin borde y con una sombra muy leve (`--sombra-reposo`).",
        "La pantalla tiene un solo scroll (DC-015): el título, el texto guía y la lista se desplazan, y solo la fila buscador + «Estado» queda fija. Antes el único scroll era el de la lista y el buscador quedaba siempre arriba.",
        "Cuando la barra se pega, el disparador «Estado» se oculta con un fundido y el buscador ocupa todo el ancho (DC-024).",
        "El placeholder del buscador cambia de «Buscar por nombre» a «Buscar por evento» (DC-026).",
        "Los bordes del buscador y del disparador pasan de `gray-500` a `gray-600`, para que el control llegue a 3.4:1. El subtítulo de la tarjeta baja de 15 a 14 px.",
        "La tarjeta de un evento finalizado queda «en reposo»: imagen desaturada (saturación .45) y título en `gray-800`."
      ] },
      { titulo: "Qué se agregó", items: [
        "Texto guía bajo el título: «¡Estos son tus eventos asignados para diligenciar!».",
        "Extra de la demo: el evento `e3`, «XXIII Juegos Deportivos Nacionales» (finalizado), para que el filtro «Finalizado» y el aviso de plazo tengan un caso. `e4` y `e5` también son extras: ninguno de los tres existe en `coc_sample.dart`.",
        "El aviso de plazo de la tarjeta finalizada es un `NwtAlert` del SDK (tema caution, variante quiet) que dice «Editable hasta el 18 mar. 2026». Al tocarlo se despliega «Puedes editar las evaluaciones que registraste hasta 10 días después de que termine el evento.» y la flecha gira.",
        "Sombra común de las barras fijas (DC-016): solo aparece cuando hay scroll y la barra está pegada.",
        "Las tarjetas entran escalonadas, pero solo al abrir la pantalla."
      ] },
      { titulo: "Qué se mejoró", items: [
        "La lista tiene un alto mínimo para que la barra no se suelte al filtrar con pocos resultados. El estado vacío aparece arriba, a la vista, y no centrado.",
        "El disparador muestra lo que está elegido: «Estado» sin filtro, el nombre del estado si hay uno o «N estados» si hay varios. Con filtro activo, el borde y el texto van en `orange-700`."
      ] },
      { titulo: "Cómo se hace", items: [
        "Estado de la pantalla: `Set<String> estados` y el texto de búsqueda. El sheet trabaja sobre una copia del Set; solo «Aplicar» la pasa al estado y vuelve a pintar la lista.",
        "Datos reales: `methodologist-assignments` con los parámetros `search` y `status`. En la demo se usa `Data.eventos` (e1–e5) y se filtra en el cliente: por nombre normalizado (minúsculas y sin acentos) y por `estadoLabel`.",
        "El sheet se abre con `showModalBottomSheet`: título «Filtrar por estado», X, divisor, tres filas con casilla (En curso, Programado, Finalizado) y el botón primario «Aplicar» a 20 de la última fila.",
        "El aviso de plazo solo sale si `estado == finalizado` y el evento tiene `editableUntil`. En la demo la fecha es fija (`2026-03-18`); en la app viene de `avisoEdicionVigente` (`oc_aviso_edicion_evento.dart`). Es un acordeón con su propio estado `expanded` en cada tarjeta.",
        "Barra fija: se escucha el scroll y se marca `pegada` cuando el offset es mayor que 0 y la barra llegó a su tope. Con `pegada` se colapsa el disparador y se enciende la sombra.",
        "Estados vacíos: con filtro o búsqueda, «No encontramos eventos con esos filtros» (icono `search_off`); sin filtro, «Aún no tienes eventos asignados.» (icono `event_busy`)."
      ] },
      { titulo: "Spec Flutter", items: [
        "Origen en la app: `lib/features/eventos/presentation/pages/eventos_page.dart`, `oc_evento_card.dart`, `oc_estado_filter_sheet.dart`, `oc_aviso_edicion_evento.dart`, `OcSearchBar`, `OcStatusChip` y `OcEmptyState`.",
        "Contenido: padding 16/16/0 (`spacingsMedium.M`) sobre fondo `gray-100` `#F4F5F9`. Título «Eventos» a 28 px bold navy (`blue-jic-900`). Texto guía a 14 px `gray-700`, con 4 de margen arriba y 16 abajo.",
        "Barra fija (sugerencia: un `SliverPersistentHeader(pinned: true)` dentro de un `CustomScrollView`): 44 de alto con 8 de aire arriba y abajo, fondo `gray-100` a sangre y por encima de la lista. La sombra al pegarse es un degradado de 16 px de `rgba(24,30,71,.09)` a transparente, con un fundido de 200 ms.",
        "Buscador (`OcSearchBar`): 44 de alto, radio 26, borde de 0.5 en `gray-600` `#8788AB`, padding horizontal 18, gap 10, lupa de 24 en `gray-700`, texto de 15 px y cursor `orange-700`.",
        "Disparador «Estado»: 132×44, radio 12, padding 0 14 0 18, borde de 0.5 en `gray-600`, texto de 15 px y flecha de 24. Activo: borde de 1.5 en `orange-700`. Al pegarse la barra, el ancho baja a 0 en 200 ms y la opacidad se apaga en 150 ms.",
        "Tarjeta (`oc_evento_card.dart`): blanca, radio 16, sin borde, con sombra `0 1 2 rgba(24,30,71,.06), 0 6 18 rgba(24,30,71,.06)` y 22 de separación. Imagen de 150 de alto con `BoxFit.cover`, que aparece con un fundido de 320 ms al cargar. Cuerpo con padding 16: fila de chip + flecha de 20 en `orange-700`, título de 20 px bold navy (interlineado 1.2, máximo 2 líneas) y subtítulo de 14 px `gray-700`.",
        "Chips (`OcStatusChip`): padding 4/8, radio 20, 10 px/600. En curso: `success-100` con texto `#0F5132`. Programado: `gray-300` con texto `blue-jic-900`. Finalizado: `#FBE0E0` con texto `#B3261E`.",
        "Sheet: esquinas superiores de radio 20 y scrim negro al 54 %. Asa de 40×4 en `gray-300` con 20 debajo. Cabecera con padding 24: título de 22 px bold navy y X de 44 en `blue-jic-900`. Divisor de 1 en `gray-200` (margen 16/0/8). Fila con casilla: alto mínimo 44, padding 12/0, gap 16. Casilla de 20 con radio 4 y borde de 2 en `gray-600`; marcada se rellena de `orange-700` y el check hace un «pop» de 200 ms.",
        "Animación del sheet: entra en 300 ms con `Cubic(.32,.72,0,1)` y sale en 200 ms. El scrim tarda 260 ms en aparecer y 180 ms en irse.",
        "Entrada escalonada: cada tarjeta sube 10 px mientras aparece, en 300 ms con `Cubic(.23,1,.32,1)`, y la siguiente arranca 45 ms después (el retraso deja de crecer en la sexta). Solo pasa al abrir la pantalla, no al buscar ni al filtrar.",
        "Acordeón del aviso: el alto se anima en 240 ms con `Cubic(.23,1,.32,1)` (sugerencia: `AnimatedSize` o `SizeTransition`) y la flecha gira 180°. El texto desplegado lleva un divisor gris arriba."
      ] },
      { titulo: "Pendiente", items: [
        "De casos.js: la búsqueda por texto no se puede escribir desde un caso; funciona tecleando en la app.",
        "Confirmar si el parámetro `status` del endpoint acepta varios valores a la vez. La demo resuelve la selección múltiple en el cliente.",
        "No tienen caso la lista vacía, el pull-to-refresh ni el spinner de carga (la demo no tiene red)."
      ] }
    ]
  },

  "1.3": {
    resumen: "El menú de la barra superior abre el panel «Conoce más», que entra por la derecha con un texto y el enlace «Visítanos» a la landing del Ciclo Olímpico.",
    secciones: [
      { titulo: "Qué cambió", items: [
        "El título del panel baja a 20 px con el token del SDK `--naotech-heading6-font-size`. Antes era el h2 de 22 px.",
        "El divisor bajo «Visítanos» y el borde inferior de la barra superior pasan de `gray-300` a `gray-200`.",
        "La barra superior suma la etiqueta «Metodólogos» junto al logo (18 px bold `gray-800`, DC-017 y DC-019) y una campana de notificaciones antes del menú (ver 6.4)."
      ] },
      { titulo: "Qué se agregó", items: [
        "Al tocar «Visítanos» aparece el toast informativo «Solo en la app real», porque la demo no abre sitios externos.",
        "Movimiento: el panel entra con una curva de iOS y sale más rápido que como entra."
      ] },
      { titulo: "Cómo se hace", items: [
        "El icono de menú de `OcAppBar` abre un panel lateral derecho modal con scrim. Se cierra con la X, tocando el scrim o con atrás.",
        "Contenido: X, el título «Conoce más», el párrafo «Entérate del desarrollo de los eventos y las iniciativas del ciclo olímpico en nuestra landing page.» y la fila de enlace «Visítanos» con su flecha.",
        "En la app, «Visítanos» abre la landing dentro de la app en `oc_web_view_page.dart`, con spinner de carga y un estado de error con «Reintentar» y «Abrir en el navegador». En la demo solo muestra el toast.",
        "Sugerencia: `showGeneralDialog` con una `SlideTransition` desde `Offset(1, 0)`, o el `endDrawer` del `Scaffold` si el ancho y las esquinas se pueden personalizar."
      ] },
      { titulo: "Spec Flutter", items: [
        "Origen en la app: `shared/widgets/oc_conoce_mas_sheet.dart`, `shared/widgets/oc_app_bar.dart` y `oc_web_view_page.dart`.",
        "Panel: 94 % del ancho, pegado a la derecha, esquinas izquierdas de radio 20 y padding 24 (más el área segura superior). Entra desde `translateX(100%)` en 300 ms con `Cubic(.32,.72,0,1)` y sale en 200 ms. Scrim `rgba(40,40,52,.45)`.",
        "X: caja táctil de 44 con icono de 24 en `orange-700` y margen −10 arriba y a la izquierda. Título de 20 px bold navy con margen 16/0/8. Párrafo de 17 px `gray-700`, justificado y con 32 de margen inferior.",
        "Fila «Visítanos»: alto mínimo 44, padding 12/0 y borde inferior de 1 en `gray-200`. Texto de 16 px negro e icono `arrow-up-right` de 20 en `orange-700`. Al pulsarla, el fondo pasa a `gray-100`.",
        "Barra superior (`OcAppBar`): padding 6/16 y borde inferior de 1 en `gray-200`. Logo de 40 dentro de un botón de 44 que lleva a Eventos. Etiqueta «Metodólogos» de 18 px bold `gray-800`, con elipsis. Campana de 26 y menú de 24, ambos en `blue-jic-900`; el menú tiene margen derecho −10."
      ] },
      { titulo: "Pendiente", items: [
        "De casos.js: «Visítanos» abre la landing en la app real; aquí solo muestra un aviso.",
        "Falta la URL de la landing y confirmar en el repo Flutter que el 94 % de ancho y el radio de 20 coinciden con `oc_conoce_mas_sheet.dart`.",
        "El visor PDF / WebView (pantalla 14 del inventario) no tiene caso."
      ] }
    ]
  },

  "2.1": {
    resumen: "Se abre un evento en curso: hero con la imagen del evento, una fila resumen de los deportes a calificar y la lista de deportistas. Luego se filtra por estado «Calificado» y género «Mujer».",
    secciones: [
      { titulo: "Qué cambió", items: [
        "Cabecera del detalle: antes era una miniatura circular de 72 px con el nombre a 20 px. Ahora es un hero a sangre de 356 px con la imagen del evento fundida en blanco y el texto encima en navy y gris (DC-027, DC-031 y DC-035).",
        "El nombre del evento lleva mayúscula inicial en las palabras de más de 3 letras (DC-030): «Juegos Panamericanos de la Juventud 2026». Aplica al hero y a la barra fija.",
        "El chip de estado del hero crece: 12 px, padding 6/12 y borde blanco de 1 px al 8 % (DC-029).",
        "Deportes a calificar: antes eran un título, un icono de información y pastillas con «+N», y el icono y el «+N» abrían lo mismo. Ahora es una sola fila resumen cálida (`orange-50`) con iconos apilados, «N deportes por calificar» y los nombres. También se quitó el separador de 16 px entre el hero y el resumen (DC-034).",
        "La página tiene un solo scroll (DC-012): el hero, el resumen y el buscador se desplazan, y solo las pestañas quedan fijas. Cuando se pegan, aparece arriba el nombre del evento centrado (DC-022, DC-028 y DC-042).",
        "Filas de deportista: antes eran planas, con divisor `gray-300` y subtítulo de 16 px negro. Ahora son tarjetas `gray-100` de radio 12 con subtítulo de 14 px `gray-700`. Un deportista calificado queda «en reposo»: fondo blanco, contorno `gray-200` y título `gray-800`.",
        "Sheet de filtro: las secciones se separan con aire en vez de líneas y los rótulos bajan a 13 px con interletrado .6px. Los chips van en `gray-100` sin borde; seleccionados pasan a `orange-100` con borde `orange-700` y texto `orange-800`.",
        "La insignia del botón de filtro ahora es un círculo perfecto de 20 px; antes era un óvalo de 18×22."
      ] },
      { titulo: "Qué se agregó", items: [
        "Extra de la demo: imágenes de hero propias para e2, e4 y e5 (`assets/images/hero/*.webp`, las oficiales de la plataforma COC). e1 y e3 usan su portada; un evento sin imagen muestra un degradado de marca.",
        "Botón volver dentro del hero: chevron blanco sobre un círculo navy translúcido de 44.",
        "Barra con el nombre del evento, que solo aparece cuando las pestañas se pegan.",
        "Al volver del perfil de un deportista se conservan la pestaña, la búsqueda y los filtros."
      ] },
      { titulo: "Qué se mejoró", items: [
        "Si se cambia de pestaña con la barra pegada, la lista nueva arranca desde arriba y no a media altura.",
        "La lista tiene un alto mínimo para que la barra no se suelte con pocos resultados. El estado vacío aparece arriba, a la vista.",
        "Los bordes de los controles pasan a `gray-600` (3.4:1)."
      ] },
      { titulo: "Cómo se hace", items: [
        "Ruta `#/evento/:id`. Datos reales: el evento sale de `methodologist-assignments`, las disciplinas de `disciplines` y los candidatos y equipos de `candidates` y `teams`. En la demo todo sale de `Data.eventos[i].deportistas`.",
        "Estado de la pantalla: `{tab, query, filtro: {deporte?, estados: Set, generos: Set}}`. La demo lo guarda al ir al perfil y lo restaura al volver; en Flutter alcanza con que la página siga en la pila.",
        "Filtrado: en la app la búsqueda, el deporte y el género se resuelven en el backend, y el género solo se envía si hay exactamente uno elegido. El estado de calificación se filtra en el cliente. La demo lo hace todo en el cliente, comparando el texto normalizado con el nombre, el deporte y el colegio.",
        "Contador de filtros = estados + géneros + 1 si hay deporte. Si es mayor que 0, el botón se pinta activo y muestra la insignia con el número.",
        "Sheet «Filtrar deportistas» con tres secciones: DEPORTE (desplegable con «Todos los deportes» y los deportes de A a Z), ESTADO DE CALIFICACIÓN (Sin calificación / Calificado) y GÉNERO (Hombre / Mujer). El pie queda fijo con «Limpiar» (terciario) y «Aplicar» (primario). El sheet trabaja sobre una copia del filtro; «Aplicar» la devuelve y cierra.",
        "Título de la lista: «Deportistas inscritos» en individuales y «Deportes inscritos» en conjunto, con un chip informativo que muestra el conteo.",
        "Estados vacíos: con filtro o búsqueda, «No encontramos deportistas con esos filtros»; sin filtro, «Aún no hay resultados para calificar en esta categoría» (icono `groups_outlined`)."
      ] },
      { titulo: "Spec Flutter", items: [
        "Origen en la app: `lib/features/eventos/presentation/pages/evento_detalle_page.dart`, `oc_deportes_calificar_section.dart`, `oc_deportista_filter_sheet.dart`, `oc_deportista_tile.dart`, `OcSearchBar` (con `_FilterButton`), `OcSegmentedTabs` y `OcBackLink`.",
        "Scroll (sugerencia: `CustomScrollView`) con padding 16/16/24. El hero va como `SliverToBoxAdapter` a sangre; el nombre y las pestañas, como dos `SliverPersistentHeader(pinned: true)`.",
        "Hero (extra de la demo): alto mínimo 356. Es un `Stack` con la imagen en `BoxFit.cover` alineada a la derecha y un velo `LinearGradient` vertical blanco con estos stops: 0 y .45 con alfa 0, .72 con alfa .9 y .82 con alfa 1. El contenido va abajo con padding 48/16/20. Sin imagen se usa un degradado de 135° `blue-jic-900` → `blue-jic-700` (55 %) → `blue-jic-500` que cubre solo el 80 % superior.",
        "Texto del hero: chip de 12 px/600 con padding 6/12 y borde de 1 en blanco al 8 %. Nombre de 24 px bold navy (`--fs-sujeto`), interlineado 1.2, máximo 2 líneas y 8 de margen superior. Fecha · lugar de 14 px `gray-700` con 4 de margen superior. Volver: círculo de 44 en `rgba(24,30,71,.45)`, en la posición 8/8, con chevron de 32 en blanco.",
        "Barra de nombre (DC-022 y DC-042): 52 de alto, fondo blanco, nombre a 16 px bold navy centrado y con elipsis. Aparece con un fundido de 180 ms solo cuando las pestañas están pegadas.",
        "Pestañas: quedan fijas justo debajo de la barra de nombre, con fondo blanco a sangre, padding superior 10 y una línea inferior de 1 en `gray-200` que respeta el margen del contenido. Texto de 15 px `gray-700`; la activa va en bold `orange-700`. El indicador es una línea de 2 px en `orange-700` que se desliza en 280 ms con `Cubic(.23,1,.32,1)`.",
        "Resumen de deportes: 74 de alto, radio 16, fondo `orange-50` `#FFF1E6`, padding 0 12 0 16 y gap 12. A la izquierda, hasta 3 círculos de 32 (blancos, con borde de 2 en `orange-50` y solapados −10) con el icono del deporte de 18 en `orange-600`. Si hay más, un círculo «+N» en `orange-100` con texto de 11 px bold `orange-800`. Título de 15 px bold. Nombres de 13 px `gray-700`: hasta 3 nombres, o el primero y «y N más». Chevron de 24 en `orange-700`.",
        "Buscador «Buscar deportista»: igual que en 1.2. Botón de filtro: 44×44, radio 12, borde de 0.5 en `gray-600` e icono `filter_list_rounded` de 20. Activo: fondo `orange-50`, borde de 1.5 en `orange-600` e icono `orange-700`. Insignia: mínimo 20×20, radio 10, fondo `orange-700`, texto blanco de 12 px/600, en la posición −4/−4.",
        "Fila de deportista: padding 12 12 12 16, radio 12, fondo `gray-100` y 8 de separación. Lleva el chip, el título de 18 px bold (margen 6), el subtítulo de 14 px `gray-700` y un chevron de 24 en `orange-700`. Calificado: fondo blanco con contorno interior de 1 en `gray-200` y título `gray-800`.",
        "Sheet de filtro: alto máximo del 85 %, cuerpo con scroll y pie fijo. Secciones con padding 16/24; rótulo de 13 px bold `gray-700` con interletrado .6. Desplegable: padding 12/16, radio 12, borde de 0.5 en `gray-600` y texto de 15 px/600; abierto, borde de 1.5 en `orange-700`. Menú en `gray-100`, radio 12, alto máximo 260, que se abre en 240 ms. Chip: padding 9/16, radio 22, 15 px/600 sobre `gray-100`; seleccionado, `orange-100` con borde `orange-700` y texto `orange-800`. Pie con padding 16 24 24: «Limpiar» flex 1 y «Aplicar» flex 2, con gap 12.",
        "Chip de conteo (`OcStatusChip` info): fondo `#CEF4FF`, texto `blue-900` `#002b5b`, 14 px y padding 4/14.",
        "Al cambiar de pestaña, la lista entra con opacidad y `translateY(6)` en 200 ms con `Cubic(.23,1,.32,1)`."
      ] },
      { titulo: "Pendiente", items: [
        "De casos.js: la búsqueda por nombre no se puede escribir desde un caso, y el filtro por deporte (lista desplegable) tampoco se recorre aquí.",
        "Decisión de diseño: el detalle tiene dos capas fijas (barra de nombre + pestañas), lo que rompe la regla «como mucho una barra fija por pantalla» de `docs/JERARQUIA.md`. Decidir si se mantiene así.",
        "Las imágenes de hero solo existen para e2, e4 y e5. Hay que confirmar de qué campo del evento saldría la imagen del hero en el servicio.",
        "Confirmar en el repo Flutter cómo se llaman los parámetros de búsqueda, deporte y género de `candidates` y `teams`.",
        "`JERARQUIA.md` todavía describe el hero con velo navy y texto blanco. Manda el código (fundido en blanco con texto navy, DC-027): hay que actualizar la doc."
      ] }
    ]
  },

  "2.2": {
    resumen: "Se filtra la lista por género «Hombre», se vuelve a abrir el filtro (conserva lo elegido) y «Limpiar» + «Aplicar» devuelven la lista completa.",
    secciones: [
      { titulo: "Qué cambió", items: [
        "El pie del sheet sigue los niveles de `docs/JERARQUIA.md`: «Limpiar» es terciario (`gray-100`, sin borde, texto negro) y «Aplicar» es la única acción primaria (`orange-700`).",
        "Los chips de género y estado ahora van en `gray-100` sin borde. El seleccionado pasa a `orange-100` con borde `orange-700` y texto `orange-800`; antes era `orange-700` sobre `orange-100`, que daba 3.9:1."
      ] },
      { titulo: "Qué se agregó", items: [
        "Las casillas y los chips cambian de estado con transición, y lo que se pulsa se hunde un poco (escala .985)."
      ] },
      { titulo: "Cómo se hace", items: [
        "El sheet se abre con una copia del filtro actual: por eso, al reabrirlo, aparece «Hombre» marcado.",
        "«Limpiar» solo resetea la copia (deporte en null, estados y géneros vacíos, desplegable cerrado) y no aplica nada. El cambio llega a la lista recién con «Aplicar».",
        "Al aplicar sin filtros, el contador queda en 0: se oculta la insignia, el botón vuelve a su estado normal y la lista se pide sin `gender` ni deporte.",
        "Cerrar el sheet con la X o tocando el scrim descarta la copia: el filtro aplicado no cambia.",
        "La pantalla y el sheet son los mismos que en 2.1."
      ] },
      { titulo: "Spec Flutter", items: [
        "Origen en la app: `oc_deportista_filter_sheet.dart` (`DeportistaFiltro` con estados y géneros) y `OcButton`.",
        "«Limpiar»: `OcButton` terciario, fondo `gray-100` `#F4F5F9`, texto `#282834`, sin borde, 52 de alto, radio 12, 16/700, flex 1.",
        "«Aplicar»: `OcButton` primario, fondo `orange-700` `#D74009`, texto blanco, mismas medidas, flex 2.",
        "Pie fijo fuera del scroll del sheet: divisor de 1 en `gray-200`, padding 16 24 24 (más el área segura) y gap 12.",
        "Respuesta al toque: escala .985 en 140 ms con `Cubic(.23,1,.32,1)`. Al pulsar un botón, el brillo baja al 94 %."
      ] },
      { titulo: "Pendiente", items: [
        "De casos.js: la lista desplegable de deporte del filtro no se recorre aquí."
      ] }
    ]
  },

  "2.3": {
    resumen: "El detalle del evento separa los deportes en dos pestañas: «Deportes individuales», con una fila por deportista, y «Deportes de conjunto», con una fila por equipo.",
    secciones: [
      { titulo: "Qué cambió", items: [
        "Las pestañas son ahora la barra fija del detalle (DC-012), con una sombra que se enciende cuando la lista pasa por debajo (DC-016).",
        "El subrayado naranja se desliza de una pestaña a otra; el subrayado propio de cada pestaña se apaga para que no se vea doble.",
        "El título de la lista baja a 16 px para no competir con el nombre del evento."
      ] },
      { titulo: "Qué se agregó", items: [
        "Si se cambia de pestaña con la barra pegada, el scroll vuelve al tope de la lista.",
        "La lista nueva entra con un fundido corto al cambiar de pestaña. Al buscar o al filtrar no se anima."
      ] },
      { titulo: "Cómo se hace", items: [
        "La pestaña es parte del estado de la pantalla (`tab` 0/1) y filtra por tipo: `tipo == Conjunto` va a la pestaña 1 y el resto a la 0. La búsqueda y los filtros se mantienen al cambiar de pestaña.",
        "Fila individual: chip de estado, nombre del deportista y «deporte - categoría» (ej.: «Paraatletismo - Prejuvenil»).",
        "Fila de equipo: chip, «deporte · prueba» (ej.: «Baloncesto · Fase de grupos»), el colegio y una línea extra con «categoría · sexo».",
        "Datos reales: los individuales salen de `candidates` y los equipos de `teams`. En la demo, e1 tiene d1–d5 (individuales) y c1–c3 (Baloncesto, Voleibol y Fútbol sala).",
        "Al cambiar de pestaña cambian el título («Deportistas inscritos» / «Deportes inscritos») y el chip con el conteo.",
        "Tocar una fila lleva a `#/deportista/:id?evento=:eventoId`: el perfil del deportista (3.1) o el perfil del deporte (3.2)."
      ] },
      { titulo: "Spec Flutter", items: [
        "Origen en la app: `OcSegmentedTabs` y `oc_deportista_tile.dart` dentro de `evento_detalle_page.dart`.",
        "Pestañas: dos de igual ancho, padding superior 10, línea inferior de 1 en `gray-200`. Texto de 15 px `gray-700` con 6 de padding inferior; la activa va en bold `orange-700`. Área táctil ampliada 8 px arriba y abajo.",
        "Indicador: 2 px en `orange-700`, del ancho del texto de la pestaña activa. Se desliza con `transform` y `width` en 280 ms con `Cubic(.23,1,.32,1)` (sugerencia: `TabBar` con un `indicator` propio, o un `AnimatedPositioned` medido con `GlobalKey`).",
        "Para la lista de un equipo, la línea extra va en 14 px `gray-700` con 2 de margen superior. El resto de la fila es igual que en 2.1.",
        "Para fijar las pestañas y la sombra, ver 2.1."
      ] },
      { titulo: "Pendiente", items: [
        "De casos.js: la búsqueda por nombre no se puede escribir desde un caso.",
        "Confirmar con el backend si `teams` devuelve la prueba (disciplina) que la fila muestra junto al deporte."
      ] }
    ]
  },

  "2.4": {
    resumen: "Al tocar la fila «N deportes por calificar» se abre una hoja informativa con todos los deportes que el metodólogo tiene asignados en el evento.",
    secciones: [
      { titulo: "Qué cambió", items: [
        "Antes había un título «Deportes a calificar en este evento», un icono de información y pastillas que terminaban en «+N»; el icono y el «+N» abrían la misma hoja. Ahora una sola fila resumen hace de disparador, y la hoja muestra la lista completa.",
        "La fila es de nivel primario (lo pendiente): superficie cálida `orange-50`, sin borde. Antes era blanca con borde `gray-300`.",
        "El contador «+N» va en `orange-800` sobre `orange-100`; antes iba en `orange-700`, que no llegaba a contraste AA."
      ] },
      { titulo: "Qué se agregó", items: [
        "La fila tiene una etiqueta accesible con el número y los nombres de todos los deportes, y `aria-haspopup=dialog`."
      ] },
      { titulo: "Cómo se hace", items: [
        "Deportes del evento: si el evento trae `sportCodes` vacío, se toma el evento completo y se listan los nombres de deporte distintos de los candidatos, en el orden en que aparecen. En la demo, `Data.deportesDelEvento(ev)`; e1 tiene 8: Paraatletismo, Paranatación, Ciclismo, Gimnasia, Tenis de mesa, Baloncesto, Voleibol y Fútbol sala.",
        "La fila muestra los 3 primeros iconos más «+N». Con hasta 3 deportes, el texto los nombra a todos («A, B y C»); con más, nombra el primero y «y N más».",
        "La hoja se abre con `showModalBottomSheet`, sin asa ni cabecera: título «Deportes a calificar», el texto «Estos son los deportes que tienes asignados para calificar en este evento.» y las pastillas de cada deporte en un `Wrap`.",
        "El icono de cada deporte sale de `deporte_iconos.dart::deporteIconoAsset`: se busca por subcadena, de la más específica a la más general (p. ej. «tenis de mesa» antes que «tenis»), y si no hay coincidencia se usa «trofeo».",
        "Si el evento no tiene deportes, la fila no se pinta."
      ] },
      { titulo: "Spec Flutter", items: [
        "Origen en la app: `oc_deportes_calificar_section.dart` y `deporte_iconos.dart`.",
        "Fila: la misma de 2.1 (alto 74, `orange-50`, radio 16, pila de iconos de 32 y chevron de 24 en `orange-700`).",
        "Hoja: esquinas superiores de radio 20, padding 24 (más el área segura inferior). Título de 22 px bold navy. Texto de 16 px `gray-700` con margen 8/0/20.",
        "Pastilla de deporte: blanca, con borde de 2 en `orange-600` `#F05705`, radio 8 y un halo exterior de 2 en `orange-100`. Padding 6/8, icono de 16 en `orange-600` con 4 de separación y texto de 12 px/600 negro. Las pastillas se separan 8 entre sí (`Wrap(spacing: 8, runSpacing: 8)`).",
        "Animación de la hoja: entra en 300 ms con `Cubic(.32,.72,0,1)` y sale en 200 ms."
      ] },
      { titulo: "Pendiente", items: [
        "De casos.js: la hoja es informativa; no se puede filtrar ni elegir un deporte desde ahí.",
        "Decisión de producto: ¿tocar una pastilla debería filtrar la lista por ese deporte? Hoy esa acción solo existe en el sheet de filtro.",
        "Confirmar en el repo Flutter de qué campo sale `sportCodes` y cómo se cruzan los códigos con los nombres de `disciplines`."
      ] }
    ]
  },

  "2.5": {
    resumen: "Historia PROD-59: en un evento programado (Dakar) el metodólogo ve sus 6 atletas y 2 equipos asignados, aunque el evento no haya empezado. Las pruebas aparecen bloqueadas con el motivo «El evento aún no inicia».",
    secciones: [
      { titulo: "Qué cambió", items: [
        "Antes el metodólogo veía 0 atletas en un evento «Programado», aunque tuviera boxeo, lucha y esgrima asignados. Ahora la lista muestra los atletas y equipos asignados sea cual sea el estado del evento.",
        "En la prueba, «Iniciar formulario» se reemplaza por el motivo del bloqueo («El evento aún no inicia») y «No se puede calificar». En el equipo, «Calificar en conjunto» se reemplaza por el mismo bloqueo.",
        "La prueba o el equipo bloqueado queda «en reposo»: fondo blanco con contorno `gray-200` en vez de la superficie cálida de lo pendiente.",
        "El texto del motivo pasa de `gray-500` a `gray-700` para llegar a contraste AA."
      ] },
      { titulo: "Qué se agregó", items: [
        "Extra de la demo: el evento `e5`, «Juegos Olímpicos de la Juventud Dakar 2026» (31 Oct.-13 Nov., Dakar, Senegal, programado), con su hero `hero-joj2026.webp` y lista propia: d6–d11 (boxeo, lucha y esgrima) más los equipos c4 (Selección de Baloncesto 3x3) y c5 (Selección de Rugby 7), con 4 integrantes cada uno.",
        "Resumen de 5 deportes a calificar: boxeo, lucha, esgrima, baloncesto y rugby (3 iconos + «+2»; texto «Boxeo y 4 más»).",
        "El evento programado `e2` (Festival deportivo escolar) también tiene ahora atletas propios (d12–d15) en lugar de compartir la lista del evento en curso.",
        "Cada prueba lleva `eventoId`. En los eventos programados (e2, e5), las pruebas reciben `blockedReason: El evento aún no inicia` y `evaluable: false`."
      ] },
      { titulo: "Qué se mejoró", items: [
        "El perfil de un atleta de un evento programado mantiene las pestañas «Calificar» e «Historial», así que el metodólogo puede revisar el historial antes de que empiece el evento."
      ] },
      { titulo: "Cómo se hace", items: [
        "Backend: la lista de candidatos y equipos (`candidates`, `teams`) tiene que devolver los asignados al metodólogo aunque el evento esté «programado». Ese era el origen de los 0 atletas.",
        "Por cada prueba, el backend dice si es evaluable y, si no lo es, el motivo (`evaluable`, `blockedReason`). La UI no calcula el bloqueo: pinta lo que llega.",
        "En el perfil del deportista, una prueba que no es evaluable muestra el bloque de motivo en lugar del botón. En el perfil del deporte, el equipo bloqueado muestra una tarjeta con el motivo en lugar de «Calificar en conjunto».",
        "Demo: `js/data.js` recorre los eventos programados y marca `blockedReason` en las pruebas de sus deportistas e integrantes.",
        "El recorrido es: Eventos → tarjeta e5 → detalle (resumen de 5 deportes y 6 atletas) → perfil de d6 (Mateo Cárdenas, «Peso ligero 60 kg») → volver → pestaña conjunto → c4 (bloqueado)."
      ] },
      { titulo: "Spec Flutter", items: [
        "Origen en la app: `deportista_perfil_page.dart` (bloque «No se puede calificar» cuando el backend marca la prueba como no evaluable) y `evento_detalle_page.dart`.",
        "Tarjeta de prueba bloqueada: radio 16, padding 22/20, fondo blanco con contorno interior de 1 en `gray-200`. A la izquierda «Prueba» (13 px `gray-700`) y el nombre (17 px bold). A la derecha, alineado al final, el motivo (14 px bold `gray-700`, máximo 2 líneas) y debajo «No se puede calificar» (13 px `gray-700`, 2 de margen).",
        "Equipo bloqueado: la misma tarjeta con el bloque alineado al inicio y a todo el ancho.",
        "Chip «Programado»: fondo `gray-300` `#D0D4E6` con texto `blue-jic-900`.",
        "Hero, resumen y lista: ver 2.1."
      ] },
      { titulo: "Pendiente", items: [
        "De casos.js: solo se recorre el evento programado de Dakar; los datos de atletas y equipos son de muestra.",
        "Hay que confirmar con backend el contrato real: si `candidates`/`teams` ya devuelven los asignados en eventos programados y si el motivo llega como texto o como código que traduce la app.",
        "Decisión de producto: ¿el metodólogo puede preparar algo antes del evento (por ejemplo, ver la ficha de la prueba) o solo consultar?"
      ] }
    ]
  },

  "3.1": {
    resumen: "Desde el detalle del evento se abre a Valentina Ríos: barra fija con volver y «Perfil del deportista», cabecera con avatar, «Info. Deportiva» y la tarjeta de su prueba pendiente con «Iniciar formulario».",
    secciones: [
      { titulo: "Qué cambió", items: [
        "El volver y el título van ahora en la misma fila (DC-020), y esa fila es la barra fija del perfil. Su alto pasó de 52 a 62 px (DC-032).",
        "Al hacer scroll, la barra solo gana sombra y el texto cambia de «Perfil del deportista» a «Perfil de Valentina Ríos» (DC-021 y DC-039). Arriba no muestra el nombre y no hay una segunda barra que aparezca.",
        "Jerarquía: el título de la página baja a 20 px y el nombre de la persona pasa a 24 px (`--fs-sujeto`), que es lo que más pesa.",
        "Las tarjetas pierden el borde `gray-300` y pasan a superficie `gray-100`. La prueba pendiente usa la superficie cálida `orange-50`.",
        "En «Info. Deportiva», las etiquetas bajan a 13 px y el título de la tarjeta a 16 px. La intro de cada sección pasa de navy a 14 px `gray-700`.",
        "El botón «Iniciar formulario» (alto 40) tiene ahora un área táctil de 44 sin que cambie el diseño."
      ] },
      { titulo: "Qué se agregó", items: [
        "Las pestañas «Calificar» e «Historial», con un subrayado que se desliza (ver 3.3).",
        "La sombra común de las barras fijas, extendida hasta los bordes."
      ] },
      { titulo: "Cómo se hace", items: [
        "Ruta `#/deportista/:id?evento=:eventoId`. El `evento` de la URL decide qué pruebas aparecen en «Calificar». Sin ese parámetro se usa el primer evento que contiene al deportista.",
        "Datos reales: el deportista y sus pruebas vienen de `candidates` y `disciplines`, y el estado de cada prueba de `opinions` (`alreadyEvaluated`, `evaluable`, `editable`). En la demo, `Data.deportistaById(id)`, con d2 = Valentina Ríos, Paranatación, Juvenil, S10, prueba «50m libre».",
        "La pantalla se arma así: barra fija (volver + título), cabecera (avatar con la inicial, nombre, colegio con icono de casa), tarjeta «Info. Deportiva» en grilla de 2 columnas y pestañas.",
        "Las celdas de «Info. Deportiva» son Deporte (pastilla con icono), Tipo de deporte, Sexo (o «No registrado»), Clasificación funcional (solo si existe y no es «—») y Estado (chip). El estado es Calificado solo si todas las pruebas lo están.",
        "La pestaña «Calificar» muestra el título «Calificar deportista», la intro y las pruebas del evento actual que están pendientes o que todavía se pueden editar. Una prueba pendiente y evaluable lleva el chip «Sin calificación» y el botón «Iniciar formulario», que lleva a `#/evaluacion/:id/:indice`.",
        "Sin pendientes: «No hay evaluaciones pendientes. Las completadas están en el historial.»",
        "Volver: regresa al detalle del evento conservando su estado (ver 2.1)."
      ] },
      { titulo: "Spec Flutter", items: [
        "Origen en la app: `lib/features/deportistas/presentation/pages/deportista_perfil_page.dart`, `OcCard`, `OcAvatar`, `OcBackLink`, `OcStatusChip` y `OcButton`.",
        "Scroll con padding 16/16/24. La barra fija (sugerencia: `SliverAppBar(pinned: true)` con `title` que depende de `innerBoxIsScrolled`, o un `SliverPersistentHeader`) mide 62 de alto (`--topbar-h`), es blanca a sangre y va encima del contenido. Volver: caja de 44 con chevron de 32 en `orange-700`. Título: 20 px bold negro, una línea con elipsis. La sombra al pegarse es un degradado de 16 px de `rgba(24,30,71,.09)` a transparente, en 200 ms.",
        "Cabecera: avatar de 88 en `success-100` `#DEFADE` con la inicial a 34 px bold `#0F5132` y 12 de separación. Nombre de 24 px bold negro. Colegio: icono `home_outlined` de 16 en `gray-700` + texto de 16 px `gray-700`, con 2 de margen superior.",
        "Tarjeta «Info. Deportiva» (`OcCard`): fondo `gray-100`, sin borde, radio 16, padding 22/20. Título de 16 px bold con 18 de margen inferior. Filas separadas 22. Cada fila es una grilla de 2 columnas iguales con 12 de separación entre columnas y 8 entre etiqueta y valor. Etiqueta de 13 px `gray-700` (máximo 2 líneas); valor de 14 px bold.",
        "Pastilla del deporte: blanca, con borde de 2 en `orange-600` y halo de 2 en `orange-100`. Radio 8, padding 6/8, icono de 16 y texto de 12 px/600.",
        "Título de sección: 20 px bold negro. Intro: 14 px `gray-700`, justificado, interlineado 1.4. Separaciones de 4, 16 y 20 (`spacingsSmall.M`, `spacingsMedium.M`, `spacingsMedium.L`).",
        "Tarjeta de prueba pendiente: fondo `orange-50`, radio 16, padding 22/20 y 8 de separación. «Prueba» a 13 px `gray-700`; el nombre a 17 px bold con 2 de margen; 8 de aire y el chip «Sin calificación» (`orange-100` con texto `orange-800`).",
        "«Iniciar formulario»: `OcButton` primario small, 40 de alto (área táctil de 44), padding 0 12, 15 px/600, ancho según el contenido y 8 de separación a la izquierda.",
        "Pestañas: las mismas de 2.3, con el indicador deslizante en 280 ms `Cubic(.4,0,.2,1)`. Al cambiar de pestaña, el panel entra con opacidad + `translateY(6)` en 220 ms ease-out."
      ] },
      { titulo: "Pendiente", items: [
        "De casos.js: solo se muestra una deportista con la prueba sin calificar; el perfil con pruebas calificadas está en 4.3.",
        "En la app original el avatar baja la inicial 5.4 px (`Alignment(0, 0.2)`); la demo la centra. Decidir cuál queda."
      ] }
    ]
  },

  "3.2": {
    resumen: "En la pestaña de conjunto se abre la Selección de Baloncesto: «Perfil del deporte», con una sola calificación para todo el equipo e integrantes informativos. Al abrir una integrante, un aviso aclara que se califica con el equipo.",
    secciones: [
      { titulo: "Qué cambió", items: [
        "Las filas de integrantes quedan más livianas: nombre a 15 px regular (antes 16/600) y divisor `gray-200` (antes `gray-300`).",
        "Debajo del título «Integrantes del equipo» aparece la nota «Informativos: la calificación es del equipo, no por integrante.» (13 px `gray-700`).",
        "La barra fija dice «Perfil del deporte» y, con scroll, «Perfil de Baloncesto». En una integrante dice «Perfil del deportista» y luego «Perfil de» + el nombre.",
        "El aviso de la integrante es ahora una tarjeta `gray-100` sin borde, con el icono de información en `orange-700`."
      ] },
      { titulo: "Qué se agregó", items: [
        "Debajo del aviso, el perfil de la integrante muestra el historial de evaluaciones del equipo (ver 3.4)."
      ] },
      { titulo: "Cómo se hace", items: [
        "Un equipo es un deportista con `targetType == TEAM` o con integrantes. Su perfil se titula «Perfil del deporte» y la cabecera muestra el deporte (avatar con la «B» de Baloncesto) y el colegio.",
        "«Info. Deportiva» del equipo: Deporte, Tipo de deporte («Conjunto»), Género y Estado.",
        "Sección «Calificar equipo», con la intro «Diligencia la evaluación técnico-metodológica del equipo. Es una sola calificación para todo el equipo.». Debajo puede venir una de tres cosas: el botón «Calificar en conjunto» (pendiente y evaluable, ver 4.2), la tarjeta de calificado con fecha, evaluador y ver/editar, o la tarjeta de bloqueo (ver 2.5).",
        "«Integrantes del equipo»: una lista de enlaces a `#/deportista/:equipoId-m:n`. Sin integrantes: «El equipo se encuentra sin integrantes» (icono `group_off_outlined`).",
        "En la app, que alguien es integrante lo marca el backend (`esMiembroEquipo`). La muestra no lo trae, así que la demo lo deduce de la lista de miembros de cada equipo.",
        "Perfil de una integrante: no muestra pestañas ni la sección de calificar. «Info. Deportiva» va sin Clasificación ni Estado, y luego viene el aviso «Este deportista se califica como parte del equipo («Calificar en conjunto»); no se califica individualmente.»"
      ] },
      { titulo: "Spec Flutter", items: [
        "Origen en la app: `deportista_perfil_page.dart` (la misma página con la rama de equipo y la de integrante).",
        "«Calificar en conjunto»: `OcButton` primario large, a todo el ancho, 52 de alto, radio 12, 16/700, `orange-700`.",
        "Fila de integrante: padding 16/0, borde inferior de 1 en `gray-200`, nombre de 15 px regular negro y chevron de 24 en `orange-700`. Es un enlace a todo el ancho.",
        "Tarjeta de aviso: `gray-100`, radio 16, padding 22/20. Icono `info_outline` de 24 en `orange-700` con 8 de separación y texto de 16 px.",
        "Vacío de integrantes: centrado, padding 32/20, icono de 40 en `gray-400` y texto de 14 px `gray-700`.",
        "La barra fija y la cabecera son como en 3.1."
      ] },
      { titulo: "Pendiente", items: [
        "De casos.js: no se recorren el equipo ya calificado ni un equipo sin integrantes.",
        "Confirmar en el repo Flutter si `esMiembroEquipo` llega del backend en el endpoint de candidatos o si la app lo calcula."
      ] }
    ]
  },

  "3.3": {
    resumen: "Historia PROD-59: en el perfil de Javier Manríquez, la pestaña «Historial» reúne todas sus evaluaciones del ciclo agrupadas por evento. «Descargar historial» genera un Excel con una fila por evaluación.",
    secciones: [
      { titulo: "Qué cambió", items: [
        "El perfil individual se divide en dos pestañas. «Calificar» muestra solo lo del evento por el que se entró (pendientes y evaluaciones todavía editables). «Historial» muestra todas las evaluaciones completadas de todos los eventos del ciclo.",
        "Cada evaluación tiene una sola acción: el lápiz mientras el plazo sigue abierto y el ojo (solo lectura) cuando ya no se puede editar.",
        "Las tarjetas de evaluaciones calificadas quedan compactas, en superficie `gray-100` y sin borde. Si el plazo ya venció, la tarjeta queda «en reposo»: blanca, con contorno `gray-200`.",
        "El rótulo de cada grupo por evento pasa de 14 px negro a 13 px bold `gray-800` y los grupos se separan con 20 de aire."
      ] },
      { titulo: "Qué se agregó", items: [
        "Extra de la demo: «Descargar historial» genera en el navegador un `.xlsx` real (`js/xlsx.js`, un ZIP sin comprimir con XML de hoja de cálculo) llamado `historial-evaluaciones-:nombre.xlsx`.",
        "El Excel tiene una cabecera (título, deportista, deporte, categoría, colegio o institución, y fecha de generación · metodólogo) y una tabla con las columnas Evento, Estado del evento, Prueba, Fecha de evaluación, Evaluador, Plazo de edición, Países en la prueba, N.º de atletas, Aspecto técnico, Aspecto táctico, Preparación física, Conclusiones y Recomendaciones.",
        "Toast de éxito al descargar: «Historial descargado» / «El archivo quedó en tu dispositivo.» (3500 ms).",
        "El plazo en cada tarjeta es un `NwtAlert` mute del SDK: informative con «Editable hasta el 2 de septiembre de 2026», o negative con «El plazo de edición terminó el 18 de marzo de 2026».",
        "Datos de muestra en varios eventos: d1 tiene evaluaciones en e1 (100m planos), e4 (Relevo 4x100, editable) y e3 (100m planos, plazo vencido). e4 es un segundo evento en curso al mismo tiempo."
      ] },
      { titulo: "Qué se mejoró", items: [
        "Los grupos se ordenan con los eventos en curso primero y después el resto, en el orden de la lista de eventos.",
        "En el historial la tarjeta no repite el chip «Calificado»: estar en el historial ya lo dice."
      ] },
      { titulo: "Cómo se hace", items: [
        "«Historial»: todas las pruebas calificadas del deportista, de cualquier evento y en cualquier estado, agrupadas por `eventoId`. Cada grupo tiene un rótulo con el nombre del evento y su chip de estado.",
        "Plazo: si `editable` es verdadero, «Editable hasta el» + la fecha de `editable_until` y el lápiz (`#/evaluacion/:id/:i?modo=editar`). Si no, «El plazo de edición terminó el» + la fecha y el ojo (`?modo=ver`). Sin `editable_until` no se muestra texto de plazo.",
        "Datos reales: las evaluaciones son las opiniones de `opinions` (GET) con `editable` y `editable_until`, y una ventana de edición de 10 días después del evento. La demo usa una opinión de muestra para las pruebas que ya vienen calificadas (`js/data-evaluacion.js`).",
        "Excel: la demo lo arma en el cliente. En Flutter hay dos opciones. (a) Un endpoint del backend que genere el archivo y la app lo descargue y lo comparta. (b) Armarlo en el dispositivo con un paquete de hojas de cálculo y guardarlo/compartirlo. Ver «Pendiente».",
        "Abrir una evaluación de e3 (el ojo, `perfil-ver-4`) lleva al formulario en solo lectura con el aviso del plazo vencido (ver 4.3).",
        "Sin evaluaciones completadas: «Aún no hay evaluaciones completadas.» y no se muestra el botón de descarga."
      ] },
      { titulo: "Spec Flutter", items: [
        "Origen en la app: `deportista_perfil_page.dart`. Las pestañas, el historial y el Excel son extras de esta historia.",
        "Rótulo de grupo: fila con nombre (13 px bold `gray-800`, elipsis) + chip de estado a la derecha, con margen 20/0/8.",
        "Tarjeta compacta: radio 16, padding 14 12 14 20, gap 8, fondo `gray-100`, 8 de separación. Título de 17 px bold. Metadatos: filas de 13 px `gray-700` con iconos `reloj` y `usuario` de 16, 2 de separación entre filas y 8 de margen superior. Plazo vencido: fondo blanco con contorno interior de 1 en `gray-200`.",
        "Botón de acción: 36×36 (`--touch-target`, área táctil de 44), fondo `orange-100`, radio 8, icono de 20 en `orange-700` (`lapiz` u `ojo-abierto`).",
        "`NwtAlert` mute: icono de 16 sin fondo, texto con el tono 700 del tema (`--naotech-theme-color-700`) para llegar a AA sobre blanco. Informative usa un círculo con «i»; negative, un círculo con «!».",
        "«Descargar historial»: `OcButton` cream, a todo el ancho, 52 de alto, fondo `orange-100` `#FFEDC7`, texto `orange-800` `#B83100`, icono `download` de 20 a la izquierda.",
        "Columnas del Excel (anchos de la demo, en caracteres): 34, 16, 22, 24, 26, 36, 24, 12, 48, 48, 48, 48, 48. Hoja «Historial». Los textos largos van con ajuste de línea y alineados arriba.",
        "Sugerencia para Flutter: paquete `excel` + `path_provider` + `share_plus`, o descargar un archivo generado por el servicio. Es una sugerencia, no una decisión."
      ] },
      { titulo: "Pendiente", items: [
        "De casos.js: el Excel se arma en el navegador con datos de muestra; en la app real lo pediría al servicio. Solo un deportista de la muestra tiene evaluaciones en varios eventos (Javier Manríquez).",
        "Decisión técnica: ¿el Excel lo genera el backend (endpoint nuevo) o la app? Si es el backend, falta definir el endpoint y su formato.",
        "Falta confirmar con backend que `opinions` se pueda consultar por deportista para todo el ciclo, no solo por evento."
      ] }
    ]
  },

  "3.4": {
    resumen: "Historia PROD-59: en un deporte de conjunto, el perfil de una integrante de la Selección de Voleibol muestra el historial de evaluaciones del equipo. Desde ahí solo se puede ver y descargar; la edición se hace desde el perfil del deporte.",
    secciones: [
      { titulo: "Qué cambió", items: [
        "El perfil de una integrante deja de ser solo informativo: debajo del aviso «se califica como parte del equipo» aparece el historial de evaluaciones del equipo.",
        "Desde una integrante, la acción es siempre el ojo (solo lectura), aunque la evaluación del equipo todavía se pueda editar."
      ] },
      { titulo: "Qué se agregó", items: [
        "Si la evaluación todavía se puede editar, la tarjeta lo dice con un `NwtAlert` mute informative: «Editable hasta el 2 de septiembre de 2026. Hazlo desde el perfil del deporte.», con un enlace a `#/deportista/c2`. Si el plazo ya cerró, la tarjeta no dice nada.",
        "«Descargar historial» desde la integrante baja el Excel del equipo. En la cabecera del archivo van «Equipo» y además «Integrante consultado».",
        "Datos de muestra: la Selección de Voleibol (c2) tiene «Semifinal» en e1 (editable) y «Cuartos de final» en e3 (plazo vencido)."
      ] },
      { titulo: "Cómo se hace", items: [
        "Para una integrante, se busca su equipo (`equipoDeMiembro`) y se listan las pruebas calificadas del equipo agrupadas por evento, como en 3.3 pero en modo solo lectura.",
        "Cada tarjeta lleva fecha, evaluador, la acción ojo (`#/evaluacion/c2/:indice?modo=ver`) y, solo si la evaluación es editable, el aviso con el enlace al perfil del deporte.",
        "El formulario se abre en solo lectura con el banner «Evaluación registrada · solo lectura» y el botón «Volver al perfil», que regresa al perfil de la integrante.",
        "Excel: las mismas columnas que en 3.3, con los datos del equipo. «Integrante consultado» registra quién hizo la descarga.",
        "Datos reales: las opiniones del equipo (`opinions` con el sujeto equipo) y la pertenencia del integrante al equipo (`teams`)."
      ] },
      { titulo: "Spec Flutter", items: [
        "Origen en la app: `deportista_perfil_page.dart` (rama del integrante). El historial del equipo es un extra de esta historia.",
        "Tarjeta: la compacta de 3.3, sin chip, con solo el ojo. El enlace dentro del aviso va en bold y subrayado (desplazamiento de 3 px), con el color del texto del aviso.",
        "Aviso de integrante, rótulos de grupo y botón de descarga: igual que en 3.2 y 3.3.",
        "Banner de solo lectura: ver 4.3."
      ] },
      { titulo: "Pendiente", items: [
        "De casos.js: la evaluación es del equipo; desde el perfil del integrante solo se ve y se descarga, no se edita. La edición se hace en el perfil del deporte y solo mientras el plazo siga abierto.",
        "Decisión de producto: ¿el integrante (o su entrenador) debe poder descargar el historial del equipo, o la descarga es solo del metodólogo?"
      ] }
    ]
  },

  "4.1": {
    resumen: "Se abre el formulario de evaluación de la prueba 50m libre de Valentina Ríos, se pulsa «Guardar evaluación» sin llenar nada y cada campo obligatorio muestra su error, junto con un aviso abajo.",
    secciones: [
      { titulo: "Qué cambió", items: [
        "Cada sección abre con una banda tonal `blue-jic-50` (radio 8, texto `blue-jic-900`) para que el formulario se lea por bloques. Antes era solo texto.",
        "Los campos precargados o bloqueados son una superficie `gray-100` sin borde. Los editables mantienen el borde, que pasa de `gray-300` a `gray-600` para llegar a 3.4:1.",
        "Asterisco y errores pasan de `error-400` (2.4:1) a `error-700` (5.07:1). La etiqueta del campo pasa de `gray-700` a negro.",
        "Al salir el título de la vista aparece una barra compacta fija con volver + «Formulario de evaluación» (DC-013), de 62 px."
      ] },
      { titulo: "Qué se agregó", items: [
        "El aviso de campos faltantes es un `NwtToast` del SDK con tema warning: «Faltan campos» / «Revisa los campos obligatorios.» (6000 ms).",
        "El error de cada campo entra con un pequeño desplazamiento (200 ms).",
        "Al enviar, la carga se muestra con el logo animado del COC (el del login) a 132 px, durante un ciclo de 2000 ms."
      ] },
      { titulo: "Qué se mejoró", items: [
        "Después del primer intento de guardar, la validación corre en vivo mientras se escribe.",
        "En «No. de atletas» se borra cualquier carácter que no sea dígito mientras se escribe.",
        "Tocar fuera de un campo o arrastrar el scroll cierra el teclado (como `onDrag` de la app)."
      ] },
      { titulo: "Cómo se hace", items: [
        "Ruta `#/evaluacion/:deportistaId/:indicePrueba`. Sin `modo` es crear; con `?modo=ver`, solo lectura; con `?modo=editar`, edición si la opinión es `editable`.",
        "Sección 1, «Identificación del deportista»: Nombre, Deporte, Modalidad y Prueba, precargados y bloqueados («Datos precargados desde la inscripción.»).",
        "Sección 2, «Contexto de la prueba»: «Países en la prueba», opcional, con la ayuda «Opcional. Nombres de países separados por coma.». «No. de atletas en la prueba», obligatorio y numérico (placeholder «Ej: 12»).",
        "Sección 3, «Evaluación técnico-metodológica»: aspecto técnico, aspecto táctico y preparación física. Sección 4, «Cierre de la evaluación»: conclusiones y recomendaciones. Son 5 áreas de texto obligatorias de hasta 1000 caracteres, con contador.",
        "Validación (`_athletesError` y `_requiredError`). Atletas vacío: «Ingresa el número de atletas.»; atletas no numérico o ≤ 0: «Ingresa un número válido.»; texto obligatorio vacío: «Este campo es obligatorio.».",
        "Con errores, se marcan los campos y se muestra el toast. Sin errores, se abre `OcConfirmScreen` («Confirmar envío») con «Sí, enviar» y «No, seguir editando».",
        "«Sí, enviar» llama a `opinions` (POST): la app crea la opinión y el backend la devuelve editable dentro del plazo. Al volver al perfil se muestra el toast «Evaluación registrada» / «Quedó guardada en el historial del deportista.». La demo guarda en memoria (`Evaluaciones.save`) y marca la prueba como «Calificado».",
        "«Cancelar» vuelve al perfil sin guardar."
      ] },
      { titulo: "Spec Flutter", items: [
        "Origen en la app: `lib/features/evaluacion/presentation/pages/evaluacion_formulario_page.dart`, `atoms/oc_text_field.dart`, `molecules/oc_banner.dart`, `molecules/oc_confirm_screen.dart` y `atoms/oc_loading_indicator.dart`.",
        "Scroll con padding 16/16/24. Título «Formulario de evaluación» a 28 px bold navy. Descripción de 15 px `gray-700`, justificada. Divisor de 1 en `gray-200` a todo el ancho.",
        "Barra compacta (sugerencia: `SliverAppBar` que aparece al pasar el título, o un `AnimatedOpacity` con `ScrollController`): 62 de alto, blanca, borde inferior de 1 en `gray-200`. Volver de 44 y título de 16 px bold negro. Aparece con opacidad en 180 ms y sube 8 px en 220 ms con `Cubic(.23,1,.32,1)`. Mientras está oculta no recibe toques.",
        "Banda de sección: margen 20/0/12, padding 8/12, fondo `blue-jic-50` `#EBEDF6`, radio 8, texto de 16 px bold `blue-jic-900`.",
        "`OcTextField`: título de 15 px negro (padding 0 0 2 4) y `*` de 20 px bold `error-700`. Caja con radio 12, borde de 1 en `gray-600` y padding horizontal 16; el texto de 15 px lleva padding vertical 12. Con foco, borde de 2 en `orange-700`. Con error, borde `error-600` `#ED314A`.",
        "Campo bloqueado: `gray-100` sin borde y texto de 16 px negro. Campo de referencia: texto `gray-700`.",
        "Área de texto: 104 de alto, redimensionable con una esquina de 96 a 420. Contador «n/1000» de 13 px `gray-700`, alineado a la derecha.",
        "Mensaje de error: 13 px `error-700` `#DA1630` con el icono `cancelar` de 16, gap 6 y 8 de margen superior.",
        "Acciones: margen superior 24, gap 12. «Cancelar» (`OcButton` terciario medium, 44 de alto, flex 1) y «Guardar evaluación» (primario medium, 44, flex 2), con texto de 15 px.",
        "`OcConfirmScreen`: pantalla completa con padding 24. Círculo de 48 en `orange-700` con «!» de 24 en blanco. Título de 22 px bold navy (margen 16/0/8). Texto de 16 px `gray-700` con interlineado 1.4. Debajo, «Sí, enviar» (primario) y «No, seguir editando» (cream con flecha a la izquierda), separados 8. Entra con un fundido de 200 ms y el contenido sube 6 px en 280 ms."
      ] },
      { titulo: "Pendiente", items: [
        "De casos.js: el marco solo pulsa, no puede escribir en los campos. Por eso no se llega a «Confirmar envío» ni a que la prueba quede «Calificado»; en la app se escribe y se confirma.",
        "Hay que confirmar en el repo Flutter los nombres exactos de los campos del POST de `opinions`. La demo usa `countries`, `athletesCount`, `technicalAspect`, `tacticalAspect`, `physicalPreparation`, `conclusions` y `recommendations`.",
        "El texto de confirmación promete que se podrá editar «dentro del plazo habilitado». Confirmar que ese plazo es de 10 días después del evento para todos los eventos."
      ] }
    ]
  },

  "4.2": {
    resumen: "Desde el perfil del deporte (Selección de Baloncesto), «Calificar en conjunto» abre el mismo formulario adaptado al equipo: delegación o institución en lugar del nombre. Vacío, marca los mismos errores.",
    secciones: [
      { titulo: "Qué cambió", items: [
        "Aplican los mismos cambios visuales del formulario que en 4.1: bandas de sección, campos bloqueados sin borde, errores en `error-700` y barra compacta."
      ] },
      { titulo: "Cómo se hace", items: [
        "El sujeto es el equipo (`esEquipo`). La ruta es la misma, `#/evaluacion/c1/0`; también existe el alias `#/evaluacion-conjunto/:id/:prueba`.",
        "La sección 1 pasa a llamarse «Identificación del equipo» y precarga Deporte, «Delegación / institución» (el colegio del equipo, o su nombre si no tiene colegio), Modalidad y Prueba.",
        "Las secciones 2 a 4, la validación, la confirmación y el envío son iguales a 4.1. Hay una sola opinión por equipo.",
        "Al guardar, el equipo queda calificado y su perfil cambia «Calificar en conjunto» por la tarjeta con fecha, evaluador y ver/editar. Los integrantes ven esa evaluación en su historial (3.4).",
        "Datos reales: `opinions` con el equipo como sujeto (en la demo, `targetType` TEAM)."
      ] },
      { titulo: "Spec Flutter", items: [
        "Origen en la app: `evaluacion_formulario_page.dart` (variante de conjunto, con delegación/institución, países en la prueba y número de atletas).",
        "Mismos componentes y medidas que 4.1. Solo cambian los textos y los campos precargados de la sección 1.",
        "Tarjeta del equipo ya calificado: `OcCard` en fila con filas de fecha y evaluador (13 px `gray-700`, iconos de 16, 8 entre filas), 8 de aire y el botón ojo o lápiz de 36."
      ] },
      { titulo: "Pendiente", items: [
        "De casos.js: tampoco se puede escribir; quedan sin recorrer el llenado y la confirmación.",
        "Confirmar en el repo Flutter qué campo trae «Delegación / institución» para un equipo (la demo usa el colegio) y si el número de atletas sigue siendo obligatorio en conjunto."
      ] }
    ]
  },

  "4.3": {
    resumen: "Desde el «Historial» de Javier Manríquez se abre con el ojo la prueba 100m planos, ya calificada. El formulario queda en solo lectura y «Volver al perfil» regresa.",
    secciones: [
      { titulo: "Qué cambió", items: [
        "Las evaluaciones completadas se ven en la pestaña «Historial»; antes estaban en la misma lista que las pendientes.",
        "Los campos en solo lectura son superficies `gray-100` sin borde, con el texto a 16 px negro.",
        "«Volver al perfil» es un botón cream (nivel secundario). Antes era cream con borde, y el borde competía con la acción primaria."
      ] },
      { titulo: "Qué se agregó", items: [
        "Cuando la evaluación tiene plazo, aparece un `NwtAlert` mute bajo el banner: informative con «Puedes editar esta evaluación hasta el …» o negative con «El plazo de edición terminó el …»."
      ] },
      { titulo: "Cómo se hace", items: [
        "Se entra con `#/evaluacion/:id/:i?modo=ver`. Hay solo lectura cuando existe una opinión y no se está editando, ya sea con `modo=ver` o con `modo=editar` sobre una opinión que no es editable.",
        "La pantalla muestra el banner «Evaluación registrada · solo lectura» y todos los campos deshabilitados con los valores de la opinión. En lugar de Cancelar/Guardar va el botón «Volver al perfil».",
        "Datos reales: GET de `opinions` con `editable` y `editable_until`. La demo muestra una opinión de muestra (países «Colombia, Brasil, México», 8 atletas y textos de ejemplo) para las pruebas que vienen calificadas.",
        "«Volver al perfil» (y el chevron) regresa a `#/deportista/:id?evento=:eventoId` (el evento de la prueba).",
        "Con `modo=editar` sobre una opinión editable, el formulario se abre editable y la confirmación dice «Confirmar cambios» («Vas a guardar los cambios de esta evaluación…»). Al guardar, el toast dice «Evaluación actualizada»."
      ] },
      { titulo: "Spec Flutter", items: [
        "Origen en la app: `evaluacion_formulario_page.dart` en modo lectura y `molecules/oc_banner.dart`.",
        "`OcBanner` success: padding 8/12, radio 12, fondo `success-100` `#DEFADE`, icono `check` de 20 y texto de 14 px `#0F5132`, gap 8 y 16 de margen superior.",
        "Aviso de plazo: `NwtAlert` mute con 8 de margen superior (ver 3.3).",
        "«Volver al perfil»: `OcButton` cream large, a todo el ancho, 52 de alto, `orange-100`/`orange-800`, con 24 de margen superior.",
        "Campos deshabilitados: los de 4.1 en su variante bloqueada. El placeholder vacío se pinta en `gray-500`."
      ] },
      { titulo: "Pendiente", items: [
        "De casos.js: la edición dentro del plazo no se recorre, porque ninguna prueba de los datos fijos es editable.",
        "Corrección al «falta»: los datos sí tienen evaluaciones editables, Relevo 4x100 de d1 en e4 (lápiz `perfil-editar-3`, hasta el 2 de septiembre de 2026) y Semifinal de c2. Lo que impide el caso es que el marco no puede escribir. Habría que actualizar el texto de `falta` en casos.js.",
        "Confirmar en el repo Flutter qué método HTTP usa la edición (PUT o PATCH sobre `opinions`) y si el backend vuelve a validar la ventana de 10 días."
      ] }
    ]
  },

  "5.1": {
    resumen: "La pestaña «Mi perfil» muestra el nombre, el rol y el correo del metodólogo. «Cerrar sesión» vuelve al formulario de inicio de sesión sin repetir el splash.",
    secciones: [
      { titulo: "Qué cambió", items: [
        "El título «Mi perfil» baja a 20 px y el nombre del usuario pasa a 24 px (`--fs-sujeto`), que es lo que más pesa.",
        "La tarjeta «Info. Personal» pierde el borde `gray-300` y pasa a superficie `gray-100`. Su título baja a 16 px.",
        "«Cerrar sesión» queda como secundario cream, sin borde, con texto `orange-800`.",
        "Al cerrar sesión se vuelve al formulario, no al splash (ver 1.1). El borde superior de la barra inferior pasa a `gray-200`."
      ] },
      { titulo: "Qué se agregó", items: [
        "Transición entre pestañas: el contenido sube con un fundido y el subrayado de la barra inferior crece desde el centro."
      ] },
      { titulo: "Cómo se hace", items: [
        "Ruta `#/perfil` con la barra inferior en «Mi perfil».",
        "Datos reales: `/me`, que trae usuario, rol y correo. Demo: usuario fijo de `coc_sample.dart` (Juan José Pérez Granados, Metodólogo, rusbel.pinto@gmail.com).",
        "Cabecera: avatar con la inicial, nombre y rol. La tarjeta «Info. Personal» tiene la etiqueta «Email» y el valor («—» si no hay correo).",
        "«Cerrar sesión»: en la demo, `Session.logout()` limpia la sesión en memoria. Después navega a login y el guard impide volver atrás a pantallas privadas.",
        "Barra inferior: «Eventos» (icono calendario) y «Mi perfil» (icono usuario). La pestaña activa va en `orange-700` con una barra de 2 px debajo."
      ] },
      { titulo: "Spec Flutter", items: [
        "Origen en la app: `lib/features/perfil/presentation/pages/mi_perfil_page.dart`, `OcAvatar`, `OcCard` y `shared/widgets/oc_bottom_nav.dart`.",
        "Contenido con padding 16/16/0. «Mi perfil» a 20 px bold navy con 16 de margen inferior.",
        "Cabecera: avatar de 88 en `success-100` con la inicial a 34 px bold `#0F5132` (la app la baja con `Alignment(0, 0.2)`: padding superior de 10.8). Gap de 12. Nombre de 24 px bold negro; rol de 16 px `gray-700`.",
        "Tarjeta: `gray-100`, radio 16, padding 22/20, 20 de margen inferior. Título de 16 px bold con 12 abajo. Etiqueta de 13 px `gray-700`. Valor de 15 px negro que puede cortarse en cualquier carácter.",
        "«Cerrar sesión»: `OcButton` cream large, 52 de alto, radio 12, icono `cerrar-sesion` de 20 volteado en horizontal.",
        "`OcBottomNav`: borde superior de 1 en `gray-200` y padding 12 arriba / 8 abajo (o el área segura). Cada ítem lleva un icono de 20, la etiqueta a 12 px/600 con margen 4/0 y una barra de 2×40. Inactivo `gray-700`; activo `orange-700`.",
        "Cambio de pestaña: el contenido entra con opacidad y `translateY(6)` en 220 ms con `Cubic(.23,1,.32,1)`, y la barra activa crece desde `scaleX(.3)` en 280 ms."
      ] },
      { titulo: "Pendiente", items: [
        "De casos.js: aquí «Cerrar sesión» solo limpia la sesión en memoria; el login real pasa por Keycloak.",
        "Confirmar en el repo Flutter qué hace el logout real (cierre de sesión en Keycloak, borrado del token).",
        "Decisión de producto: ¿«Cerrar sesión» debe pedir confirmación antes de salir?"
      ] }
    ]
  },

  "6.1": {
    resumen: "Historia PROD-59: 30 minutos antes de la prueba de una deportista asignada, le llega al metodólogo el aviso «Valentina Ríos compite pronto». Al tocarlo, la app se abre en el perfil de la deportista.",
    secciones: [
      { titulo: "Qué se agregó", items: [
        "Extra de la demo: la app Flutter original todavía no tiene alertas automáticas. La demo las simula en `js/data-alertas.js` y las muestra en un inicio de celular falso, `#/celular?ntf=compite`.",
        "Alerta `compite`. Destinatario: el metodólogo. Disparador: 30 minutos antes de que empiece la prueba de un deportista que tiene asignado. Tema del SDK: caution. Destino: el perfil del deportista.",
        "Textos: título «Valentina Ríos compite pronto»; mensaje «50m libre (Paranatación) empieza en 30 min. Recuerda calificarla cuando termine.».",
        "En el inicio del celular, el aviso baja desde arriba a los 250 ms y el icono de la app muestra una insignia «1».",
        "La insignia del aviso es un `nwt-avatar-icon` del SDK con el tema caution (glifo «!»)."
      ] },
      { titulo: "Cómo se hace", items: [
        "En Flutter no hay que construir el «inicio del celular»: es solo la forma en que la demo muestra la notificación del sistema.",
        "Backend: un proceso programado que, 30 minutos antes del inicio de cada prueba, envía una notificación a los metodólogos que tienen ese deportista asignado. El dato del horario de la prueba tiene que existir en el servicio.",
        "App: recibe la notificación con un payload que trae el id del deportista y el id del evento. Al tocarla, abre `#/deportista/:id?evento=:eventoId` (en la demo `d2` y `e1`) y, si no hay sesión, pasa antes por el login.",
        "El mismo aviso queda guardado en la bandeja de la app (ver 6.4).",
        "Demo: al tocar el aviso se ejecutan `Session.login()` y `Router.go(destino)`, y la app abre en el perfil de Valentina Ríos con la prueba «50m libre» lista para «Iniciar formulario»."
      ] },
      { titulo: "Spec Flutter", items: [
        "Sugerencia (no confirmada en el repo): `firebase_messaging` para el push y `flutter_local_notifications` para mostrarlo con la app abierta. El deep link lleva al mismo router (`app_router.dart`).",
        "La apariencia del banner la decide el sistema operativo. En la demo se imita el estilo iOS: radio 24, fondo `rgba(250,250,252,.84)` con desenfoque de 24, padding 12/14, icono de la app de 40 con radio 10 y la insignia del tema de 18 abajo a la derecha. App en mayúsculas a 11.5 px bold, «ahora», título de 14.5 px y mensaje de 13.5 px.",
        "Entrada del banner en la demo: desde `translateY(-150%)` en 420 ms con `Cubic(.32,.72,0,1)` y opacidad en 220 ms. La insignia del icono aparece con un «pop» de 280 ms.",
        "Tema caution del SDK de Naowee (`nwt-theme=caution`) para el icono del aviso dentro de la app (bandeja). En la notificación del sistema se usa el icono de la app."
      ] },
      { titulo: "Pendiente", items: [
        "De casos.js: los avisos son simulados; no hay notificaciones push reales ni reloj del evento. El celular marca siempre la misma hora.",
        "Backend: hace falta el horario de inicio de cada prueba y una regla de envío (cron o cola). Hoy no hay endpoint documentado para eso.",
        "Decisión de producto: ¿los 30 minutos son fijos o configurables? ¿Qué pasa si el metodólogo tiene muchas pruebas seguidas: un aviso por prueba o uno agrupado?",
        "El texto usa el femenino («calificarla»). Hay que armarlo según el sexo del deportista o con una frase neutra."
      ] }
    ]
  },

  "6.2": {
    resumen: "Historia PROD-59: cuando termina la prueba de una deportista asignada que aún no tiene calificación, llega el aviso «Valentina Ríos terminó su prueba». Al tocarlo se abre su perfil, listo para iniciar el formulario.",
    secciones: [
      { titulo: "Qué se agregó", items: [
        "Extra de la demo: la alerta `termino`. Destinatario: el metodólogo. Disparador: cuando termina la prueba de un deportista que tiene asignado y que todavía no ha calificado. Tema del SDK: informative (glifo «i»). Destino: el perfil del deportista.",
        "Textos: título «Valentina Ríos terminó su prueba»; mensaje «50m libre (Paranatación) ya terminó. Califícala para que quede en el historial.».",
        "Se ve en `#/celular?ntf=termino`, con el mismo inicio de celular y la misma insignia que en 6.1."
      ] },
      { titulo: "Cómo se hace", items: [
        "Backend: al marcarse una prueba como terminada (o a su hora de fin), se envía el aviso a los metodólogos asignados, siempre que no exista una opinión registrada para esa prueba.",
        "La app recibe el payload con el deportista, la prueba y el evento, y abre el perfil. Desde ahí el metodólogo pulsa «Iniciar formulario» (`perfil-iniciar-0`) y sigue el flujo de 4.1.",
        "El aviso también queda en la bandeja (6.4) como «terminó su prueba».",
        "Demo: el mismo mecanismo de 6.1 (`Alertas.aviso(termino)`), con destino `/deportista/d2?evento=e1`."
      ] },
      { titulo: "Spec Flutter", items: [
        "Sugerencia (no confirmada): el mismo canal de push de 6.1, con un tipo de mensaje distinto para que la app elija el icono y el texto.",
        "Banner del sistema: el mismo de 6.1. Dentro de la app, el aviso usa el tema informative del SDK (`nwt-theme=informative`)."
      ] },
      { titulo: "Pendiente", items: [
        "De casos.js: los avisos son simulados; no hay notificaciones push reales ni reloj del evento. El celular marca siempre la misma hora; en la app real sería la hora en que termina la prueba.",
        "Backend: falta un evento o dato de «prueba terminada» (¿llega desde resultados, o se usa la hora de fin programada?).",
        "Decisión de producto: si el metodólogo no califica, ¿se manda un recordatorio después de un tiempo?"
      ] }
    ]
  },

  "6.3": {
    resumen: "Historia PROD-59: al gestor del comité le llega «Nueva evaluación recibida» cuando un metodólogo registra una evaluación. El aviso solo informa, porque la evaluación se abre en la plataforma web.",
    secciones: [
      { titulo: "Qué se agregó", items: [
        "Extra de la demo: la alerta `recibida`. Destinatario: el gestor del comité. Disparador: cuando un metodólogo registra una evaluación en la plataforma. Tema del SDK: positive (glifo de check). La app que manda el aviso es «Plataforma COC».",
        "Textos: título «Nueva evaluación recibida»; mensaje «Juan José Pérez Granados calificó a Valentina Ríos (50m libre) en Juegos panamericanos de la juventud 2026.».",
        "Al tocarlo, la demo muestra el toast informativo «Solo en la plataforma web» / «En la plataforma web se abre la evaluación recibida; aquí no hay plataforma.».",
        "Este aviso no entra en la bandeja del metodólogo (6.4), que solo reúne los avisos dirigidos a él."
      ] },
      { titulo: "Cómo se hace", items: [
        "Backend: al crear una opinión (POST de `opinions`), se notifica a los gestores del comité. El mensaje lleva el metodólogo, el deportista, la prueba y el evento.",
        "El gestor no usa la app móvil de metodólogos. El aviso le llegaría por la plataforma web (notificación del navegador o in-app) y al tocarlo abriría la evaluación recibida allá.",
        "En la demo se muestra en un celular solo para enseñar el mismo patrón de aviso (`#/celular?ntf=recibida`, sin destino)."
      ] },
      { titulo: "Spec Flutter", items: [
        "No aplica a la app Flutter de metodólogos: el destinatario trabaja en la plataforma web. Lo único que toca la app es que el POST de la evaluación dispare el aviso en el backend.",
        "Tema positive del SDK de Naowee (`nwt-theme=positive`) si el aviso se pinta dentro de la plataforma."
      ] },
      { titulo: "Pendiente", items: [
        "De casos.js: el gestor trabaja en la plataforma web, que la demo no incluye. El aviso solo informa y al tocarlo se explica eso. Aquí se ve en un celular para mostrar el mismo patrón de aviso.",
        "Decisión de producto: ¿a qué gestores les llega (todos los del comité, o los de esa disciplina o evento)? ¿Por qué canal: correo, in-app web o push?",
        "Esto vive en la plataforma web: hay que coordinar con su equipo qué servicio de notificaciones lo envía (no se revisó para este caso)."
      ] }
    ]
  },

  "6.4": {
    resumen: "Historia PROD-59: la campana de la barra superior cuenta los avisos sin leer y abre la bandeja de notificaciones, con las pestañas «Recientes» y «Todas». Tocar un aviso abre el perfil del deportista y lo marca como leído.",
    secciones: [
      { titulo: "Qué cambió", items: [
        "Antes los avisos eran filas planas de borde a borde con divisor. Ahora la lista tiene aire a los lados, 8 px entre avisos y esquinas curvas de 16 px. Los no leídos van sobre fondo cálido (DC-033).",
        "Jerarquía del texto: qué pasó (16 px) > cuándo · prueba (13 px `gray-800`) > evento (13 px `gray-700`). Antes eran 15 px, 13 px `gray-700` y 13 px `gray-500`.",
        "El título de la bandeja pasa a 20 px con el token del SDK `--naotech-heading6-font-size`.",
        "La insignia de la campana pasa de `error-600` a `error-700`, porque el blanco sobre `error-600` daba 4.09:1."
      ] },
      { titulo: "Qué se agregó", items: [
        "Extra de la demo (la app original no tiene bandeja). Una campana en `OcAppBar` con una insignia que cuenta los avisos sin leer.",
        "La bandeja `#/notificaciones`. Arriba, el título y un botón con doble check para «Marcar todas como leídas», que se deshabilita cuando no queda nada por leer.",
        "Dos pestañas con contador. «Recientes» muestra los avisos de hoy, con una píldora naranja que cuenta los no leídos. «Todas» muestra todos los avisos, con una píldora blanca del total.",
        "Cada fila tiene un avatar con la inicial del deportista y la insignia del tema del aviso (caution o informative), el texto «nombre (en bold) + compite pronto / terminó su prueba», la hora · prueba · deporte y el evento. Los no leídos llevan además un punto naranja.",
        "Cada pestaña tiene su estado vacío: «No tienes avisos nuevos.» y «No tienes notificaciones.».",
        "Al salir el título de la vista aparece la barra compacta «Notificaciones»."
      ] },
      { titulo: "Qué se mejoró", items: [
        "Cuando un contador llega a 0, la píldora se encoge hasta desaparecer en lugar de borrarse de golpe, y el subrayado de la pestaña sigue el cambio de ancho cuadro a cuadro."
      ] },
      { titulo: "Cómo se hace", items: [
        "La bandeja guarda solo los avisos dirigidos al metodólogo (`compite` y `termino`); la alerta del gestor (6.3) no entra.",
        "Cada aviso guardado tiene `{id, tipo, deportistaId, indicePrueba, cuando, grupo (hoy|antes), leida}`. Los textos se arman con el deportista, la prueba y el evento.",
        "Al tocar un aviso se marca como leído, se actualiza la insignia de todas las campanas y se navega a `#/deportista/:id?evento=:eventoId`.",
        "«Marcar todas como leídas» pone `leida = true` en todos los avisos y vuelve a pintar la bandeja.",
        "Muestra de la demo: n1, Andrés Camacho terminó su prueba (hace 5 min, nueva); n2, Valentina Ríos compite pronto (hace 30 min, nueva); n3 y n4, de ayer y ya leídos. La insignia arranca en 2 y, tras tocar n2, queda en 1.",
        "Datos reales: hace falta un servicio de notificaciones del usuario (listar, marcar leída, marcar todas). La demo los tiene en memoria y el estado de lectura se pierde al recargar."
      ] },
      { titulo: "Spec Flutter", items: [
        "Origen en la app: no existe. Se construye sobre `OcAppBar`, `OcSegmentedTabs`, `OcEmptyState` y el avatar con tema del SDK de Naowee.",
        "Campana: icono de 26 en `blue-jic-900` dentro de una caja de 44. Insignia de mínimo 18×18, radio 9, fondo `error-700` `#DA1630`, borde de 2 en blanco y texto de 11 px bold, en la posición top 3 / right −1.",
        "Encabezado: volver de 44, título «Notificaciones» a 20 px bold navy y botón de doble check de 44 en `orange-700` (deshabilitado `gray-500` al 60 %), con 12 de margen inferior.",
        "Pestañas sin ancho fijo, con 20 de padding a la derecha. Contador: alto 20, radio 10, padding 0/6, 11 px bold. En «Recientes», fondo `orange-700` con texto blanco. En «Todas», blanco con texto `gray-700` y contorno interior `gray-200`. Al vaciarse se encoge en 280 ms con `Cubic(.23,1,.32,1)`.",
        "Lista: columna con gap 8 y padding superior 8. Fila: padding 16, radio 16, gap 12, fondo blanco; no leída `orange-50` (al pulsarla, `orange-100`); leída, al pulsarla, `gray-100`.",
        "Avatar de 40 en `success-100` con la inicial a 16 px bold `#0F5132`. La insignia del tema (18, borde de 2 del color de fondo de la fila) va en la posición right −5 / bottom −4.",
        "Textos: título de 16 px con interlineado 1.3 (leído en `gray-800`, nombre en bold). Cuándo · prueba: 13 px `gray-800`. Evento: 13 px `gray-700`, una línea con elipsis. Punto de no leído: 10×10 `orange-700` con 6 de margen superior.",
        "Barra compacta: la misma de 4.1 (62 de alto, aparece al pasar el título)."
      ] },
      { titulo: "Pendiente", items: [
        "De casos.js: es solo la bandeja; no hay preferencias para elegir cuándo avisar ni para silenciar por evento. Los avisos son de muestra y el estado de lectura se pierde al recargar.",
        "Backend: falta un endpoint de notificaciones del usuario (listado paginado, marcar una como leída, marcar todas) y definir cuánto tiempo se guardan.",
        "Decisión de producto: ¿qué cuenta como «Recientes»: hoy, las últimas 24 h o las no leídas? En la demo es el grupo «hoy».",
        "En la muestra, todos los avisos apuntan al evento e1. Hay que confirmar que el payload real lleve el evento de cada prueba."
      ] }
    ]
  }
};
