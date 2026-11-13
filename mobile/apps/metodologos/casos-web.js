/* Ajustes de los casos para la versión web (web.html). Los casos del móvil (casos.js) se reutilizan tal cual; aquí solo se traduce lo que cambia en escritorio:
   · el perfil del deportista tiene pestañas Datos / Pruebas / Historial (en el móvil «Calificar» ya es la primera), así que se inserta el clic en la pestaña que haga falta;
   · el título del perfil es `perfil-nombre`; el filtro de Estado de la lista es un desplegable (sin «Aplicar»);
   · la evaluación es un asistente de tres pasos (hay que pulsar «Continuar» hasta el final);
   · «Mi perfil» ya no está en el menú lateral: se entra desde el chip del usuario, y «Cerrar sesión» vive en el pie del menú.
   Un caso puede traer además titulo, falta, steps o soloMovil:true (solo existe en el marco móvil). */
(() => {
  "use strict";
  const T = (k) => ({ t: "click", sel: '[data-testid="perfil-tab-' + k + '"]', body: "Abrimos la pestaña «" + { datos: "Datos", pruebas: "Pruebas", historial: "Historial" }[k] + "»." });
  const id = (s) => (/data-testid="([^"]+)"/.exec(s || "") || [])[1] || "";
  const NECESITA = (tid, tab) => {
    if (/^perfil-(historial-lista|ver-|editar-|plazo-|descargar-historial)/.test(tid)) return "historial";
    if (/^perfil-(iniciar-|bloqueado|calificar-conjunto|equipo|integrantes-nota|integrante-)/.test(tid)) return "pruebas";
    if (/^perfil-prueba-/.test(tid)) return tab === "historial" ? "historial" : "pruebas";
    return null;
  };
  const CONT = { t: "click", sel: '[data-testid="evaluacion-continuar"]', body: "Pulsamos «Continuar»." };
  const SIN = new Set(["perfil-plazo-3", "perfil-plazo-0"]); /* avisos de plazo que en web van dentro de la fila de la prueba */

  const traducir = (c) => {
    let tab = "datos", enEval = 0;
    const out = [];
    for (const s0 of c.steps) {
      let s = s0;
      const tid = id(s.sel);
      if (s.t === "goto") { out.push(s); tab = "datos"; continue; }
      /* filtro de Estado: el desplegable aplica al elegir */
      if (tid === "estado-aplicar") continue;
      /* sidebar: «Mi perfil» se abre desde el chip del usuario; «Cerrar sesión» está en el pie del menú */
      if (tid === "nav-perfil") { out.push({ t: "click", sel: '[data-testid="web-usuario"]', body: "Abrimos el menú del usuario." }, { t: "click", sel: '[data-testid="web-menu-perfil"]', body: "Entramos a «Perfil»." }); continue; }
      if (tid === "perfil-cerrar-sesion") { out.push({ t: "click", sel: '[data-testid="web-cerrar-sesion"]', body: "Cerramos la sesión desde el pie del menú." }); continue; }
      if (SIN.has(tid)) continue;
      /* lista de deportistas: en web es una tabla (filas, no fichas) y el filtro es un desplegable sobre ella */
      const sel = s.sel && s.sel.replace('"perfil-titulo"', '"perfil-nombre"').replace('"evento-lista"', '"evento-tabla"').replace('"deportista-tile-', '"deportista-fila-').replace('"evento-filtro-badge"', '"evento-contador"');
      if (s.body) s = Object.assign({}, s, { body: s.body.replace("con «Calificar» e «Historial»", "con «Datos», «Pruebas» e «Historial»").replace("dos pestañas: «Calificar» (lo pendiente de este evento) e «Historial»", "tres pestañas: «Datos», «Pruebas» (lo pendiente de este evento) e «Historial»").replace("El perfil tiene dos pestañas: «Calificar» (lo pendiente de este evento) e «Historial»", "El perfil tiene tres pestañas: «Datos», «Pruebas» (lo pendiente de este evento) e «Historial»").replace("Se abre la hoja con", "Se abre la ventana con") });
      const need = NECESITA(tid, tab);
      if (need && need !== tab) { out.push(T(need)); tab = need; }
      /* asistente de evaluación: el botón final de solo lectura está en el último paso */
      if (tid === "evaluacion-volver-perfil" && s.t === "click") { out.push(CONT, CONT); }
      /* el asistente valida al pulsar «Continuar» en el primer paso (no hay «Guardar» hasta el último) */
      if (tid === "evaluacion-guardar" && s.t === "click") { out.push(Object.assign({}, CONT, { body: "Pulsamos «Continuar» sin llenar nada." })); continue; }
      if (tid === "evaluacion-seccion-3") { out.push(Object.assign({}, s, { sel: '[data-testid="evaluacion-seccion-2"]' })); continue; }
      if (tid === "evaluacion-campo-technicalAspect") { out.push(Object.assign({}, s, { sel: '[data-testid="snackbar"]' })); continue; }
      out.push(Object.assign({}, s, { sel }));
      if (s.t === "click") {
        if (/^perfil-tab-/.test(tid)) tab = tid.slice(11);
        else if (/^(deportista-tile-|perfil-integrante-|perfil-volver|evento-card-)/.test(tid)) tab = "datos";
        else if (/^(perfil-iniciar-|perfil-calificar-conjunto|perfil-ver-|perfil-editar-)/.test(tid)) { tab = "datos"; enEval++; }
      }
    }
    return out;
  };

  const web = {};
  (window.CASOS || []).forEach((c) => { web[c.id] = { steps: traducir(c) }; });
  /* 2.1 / 2.2: la tabla del evento filtra con los desplegables «Estado» y «Deporte» (en el móvil es una hoja con estado y género) */
  const IR_EVENTO = [{ t: "goto", url: "index.html?sesion=1#/eventos", body: "Empezamos en el inicio, con la sesión ya iniciada." }, { t: "click", sel: '[data-testid="evento-card-e1"]', body: "Abrimos el evento en curso." }];
  web["2.1"] = { falta: "La búsqueda por nombre no se puede escribir desde un caso; el filtro por deporte tampoco se recorre aquí.", steps: traducir({ steps: IR_EVENTO.concat([
    { t: "note", sel: '[data-testid="evento-deportes-calificar"]', body: "Arriba, una fila resume los deportes que el metodólogo debe calificar en este evento: cuántos son y cuáles." },
    { t: "note", sel: '[data-testid="evento-tabla"]', body: "Esta es la tabla de deportistas inscritos." },
    { t: "click", sel: '[data-testid="evento-tabla-estado"]', body: "Abrimos el filtro «Estado» de la tabla." },
    { t: "click", sel: '[data-testid="evento-tabla-op-calificado"]', body: "Elegimos «Calificado»: el filtro se aplica al instante." },
    { t: "note", sel: '[data-testid="evento-contador"]', body: "El contador muestra cuántos deportistas quedan." },
    { t: "note", sel: '[data-testid="evento-tabla"]', body: "Solo quedan los deportistas ya calificados." },
  ]) }) };
  web["2.2"] = { falta: "La lista desplegable de deporte no se recorre aquí.", steps: traducir({ steps: IR_EVENTO.concat([
    { t: "click", sel: '[data-testid="evento-tabla-estado"]', body: "Abrimos el filtro «Estado»." },
    { t: "click", sel: '[data-testid="evento-tabla-op-sincalificacion"]', body: "Elegimos «Sin calificación»." },
    { t: "note", sel: '[data-testid="evento-tabla"]', body: "La tabla se reduce a los deportistas pendientes de calificar." },
    { t: "click", sel: '[data-testid="evento-tabla-estado"]', body: "Volvemos a abrir el filtro: el estado elegido sigue marcado." },
    { t: "click", sel: '[data-testid="evento-tabla-op-todos"]', body: "«Todos» quita el filtro." },
    { t: "note", sel: '[data-testid="evento-tabla"]', body: "La tabla vuelve a mostrar todos los deportistas." },
  ]) }) };
  web["2.4"].falta = "La ventana es informativa: no se puede filtrar ni elegir un deporte desde ahí.";
  /* Avisos (6.1–6.3): en web no hay pantalla de celular; el aviso llega a la bandeja de notificaciones de la cabecera */
  const aviso = (titulo, tipo, body0, bodyAviso, fin) => ({
    steps: traducir({ steps: [
      { t: "goto", url: "index.html?sesion=1#/eventos", body: body0 },
      { t: "aviso", tipo, d: "d2", idx: 0, body: bodyAviso },
      { t: "note", sel: '[data-testid="web-campana-insignia"]', body: "La campana de la cabecera muestra la insignia con los avisos pendientes." },
      { t: "click", sel: '[data-testid="web-campana"]', body: "Abrimos la bandeja de notificaciones." },
      { t: "note", sel: '[data-testid^="web-aviso-w"]', body: "Ahí está el aviso nuevo, arriba y con el relleno claro de «sin leer»." },
      { t: "click", sel: '[data-testid^="web-aviso-w"]', body: fin.click },
    ].concat(fin.pasos) }),
  });
  web["6.1"] = aviso("", "compite", "Alerta automática. Faltan 30 minutos para la prueba de una deportista que tiene asignada.", "30 minutos antes llega el aviso: «Valentina Ríos compite pronto». Recuerda calificarla cuando termine.",
    { click: "Al tocar el aviso se abre el perfil de la deportista.", pasos: [{ t: "note", sel: '[data-testid="perfil-prueba-0"]', body: "Ahí está su prueba, lista para calificar cuando termine." }] });
  web["6.2"] = aviso("", "termino", "Alerta automática. La prueba de su deportista acaba de terminar y aún no la ha calificado.", "Cuando termina llega el aviso: «Valentina Ríos terminó su prueba». Pide calificarla para que quede en el historial.",
    { click: "Al tocarlo se abre el perfil de la deportista.", pasos: [{ t: "note", sel: '[data-testid="perfil-iniciar-0"]', body: "Desde ahí inicia el formulario de la prueba que terminó." }] });
  web["6.3"] = aviso("", "recibida", "Alerta automática para otro actor: el gestor del comité. Un metodólogo acaba de registrar una evaluación en la plataforma.", "Al registrarse la evaluación llega el aviso: «Nueva evaluación recibida», con quién la calificó, a qué deportista y en qué evento.",
    { click: "Al tocarlo, en la plataforma web se abriría la evaluación recibida.", pasos: [{ t: "note", sel: '[data-testid="snackbar"]', body: "En la demo solo avisa que ese paso se hace en la plataforma web." }] });
  /* 6.4: en web la bandeja es el panel de la campana de la cabecera (no la pantalla de notificaciones del móvil) */
  web["6.4"] = { steps: traducir({ steps: [
    { t: "goto", url: "index.html?sesion=1#/eventos", body: "Los avisos automáticos también quedan guardados dentro de la app. Empezamos en el inicio, con la sesión iniciada." },
    { t: "note", sel: '[data-testid="web-campana"]', body: "La campana de la cabecera cuenta los avisos que aún no se han leído." },
    { t: "click", sel: '[data-testid="web-campana"]', body: "Abrimos la bandeja de notificaciones." },
    { t: "note", sel: '[data-testid="web-avisos"]', body: "Dos pestañas: «Recientes», con la cantidad de avisos nuevos, y «Todas», con el total. En «Recientes» están los de hoy: los nuevos llevan un punto y fondo suave, con deportista, prueba y evento." },
    { t: "click", sel: '[data-testid="web-avisos-tab-todas"]', body: "Abrimos «Todas»: los de hoy y los de días anteriores, ya leídos." },
    { t: "click", sel: '[data-testid="web-avisos-tab-recientes"]', body: "Volvemos a «Recientes»." },
    { t: "click", sel: '[data-testid="web-aviso-n2"]', body: "Tocamos «Valentina Ríos compite pronto»: lleva al perfil de la deportista." },
    { t: "note", sel: '[data-testid="perfil-prueba-0"]', body: "Ahí está su prueba, lista para calificar." },
    { t: "note", sel: '[data-testid="web-campana-insignia"]', body: "Y el aviso quedó leído: la campana cuenta uno menos." },
  ] }) };
  /* 1.3: en web «Conoce más» es un enlace fijo al pie del menú lateral que abre la web en otra pestaña */
  web["1.3"] = { falta: "El enlace abre la web en otra pestaña; el recorrido solo lo señala, no lo pulsa.", steps: traducir({ steps: [
    { t: "goto", url: "index.html?sesion=1#/eventos", body: "Empezamos en el inicio, con la sesión ya iniciada." },
    { t: "note", sel: '[data-testid="web-conoce-mas"]', body: "Al pie del menú lateral, sobre «Cerrar sesión», está «Conoce más»." },
    { t: "note", sel: '[data-testid="web-conoce-mas"]', body: "Al hacer clic abre la web del ciclo olímpico en otra pestaña, sin sacarte de la demo." },
  ] }) };
  web["6.3"].noAplica = "No aplica para este rol"; /* es un aviso del gestor del comité: el metodólogo no lo recibe */
  /* los avisos llegan a la campana, no a un celular: se quita lo que hablaba de la hora del teléfono */
  web["6.1"].falta = "Los avisos son simulados: no hay notificaciones push reales ni reloj del evento.";
  web["6.2"].falta = "Los avisos son simulados: no hay notificaciones push reales ni reloj del evento; en la app real llegarían cuando termina la prueba.";
  web["6.3"].falta = "El gestor trabaja en la plataforma web, que la demo no incluye: el aviso solo informa y al tocarlo se explica eso.";
  window.CASOS_WEB = web;
})();
