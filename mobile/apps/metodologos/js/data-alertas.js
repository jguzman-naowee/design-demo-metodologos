/* Alertas automáticas de evaluación (extra de la demo: la app Flutter original no las trae todavía). Estática: no hay notificaciones push reales ni reloj del evento.
   Cada alerta declara sus parámetros: quién la recibe, qué la dispara, qué tema del SDK de Naowee la pinta y a dónde lleva al tocarla.
   Se muestran en el «inicio del celular» (#/celular?ntf=<id>), recorridos por los casos 6.1 a 6.3.

   Parámetros
     destinatario   Metodólogo | Gestor del comité
     disparador     la regla de negocio que las manda (texto de documentación)
     tema           tema del SDK: warning | caution | informative | positive | negative  (nwt-theme del aviso)
     icono          glifo del aviso (nwt-i, nwt-exclamacion, m-check)
     app / nombre   app que manda el aviso
     destino        ruta a la que lleva el toque (null = solo informa)
   titulo(ctx) / mensaje(ctx) arman el texto con el deportista, la prueba y el evento. */
(() => {
  "use strict";
  const D = window.Data;

  /* Caso de muestra: Valentina Ríos (d2), 50m libre, en los Juegos panamericanos de la juventud 2026 (e1, en curso) */
  const ctx = () => ({ d: D.deportistaById("d2"), p: D.deportistaById("d2").pruebas[0], ev: D.evento("e1"), metodologo: D.metodologo.nombre });

  const ALERTAS = {
    compite: {
      id: "compite", destinatario: "Metodólogo", disparador: "30 minutos antes de que empiece la prueba de un deportista que tiene asignado",
      tema: "caution", icono: "nwt-exclamacion", app: "Metodólogos", destino: "/deportista/d2?evento=e1",
      accion: "compite pronto", titulo: (c) => c.d.nombre + " compite pronto",
      mensaje: (c) => c.p.nombre + " (" + c.d.deporte + ") empieza en 30 min. Recuerda calificarla cuando termine.",
    },
    termino: {
      id: "termino", destinatario: "Metodólogo", disparador: "cuando termina la prueba de un deportista que tiene asignado y aún no la ha calificado",
      tema: "informative", icono: "nwt-i", app: "Metodólogos", destino: "/deportista/d2?evento=e1",
      accion: "terminó su prueba", titulo: (c) => c.d.nombre + " terminó su prueba",
      mensaje: (c) => c.p.nombre + " (" + c.d.deporte + ") ya terminó. Califícala para que quede en el historial.",
    },
    recibida: {
      id: "recibida", destinatario: "Gestor del comité", disparador: "cuando un metodólogo registra una evaluación en la plataforma",
      tema: "positive", icono: "m-check", app: "Plataforma COC", destino: null,
      titulo: () => "Nueva evaluación recibida",
      mensaje: (c) => c.metodologo + " calificó a " + c.d.nombre + " (" + c.p.nombre + ") en " + c.ev.nombre + ".",
    },
  };

  /* Bandeja de la app: los avisos que ya llegaron al metodólogo (solo los dirigidos a él), con su estado de lectura en memoria.
     Más recientes primero. grupo: "hoy" | "antes". Al tocar uno lleva al perfil del deportista. */
  const item = (id, tipo, deportistaId, idx, cuando, grupo, leida) => ({ id, tipo, deportistaId, idx, cuando, grupo, leida: !!leida });
  const BANDEJA = [
    item("n1", "termino", "d3", 0, "hace 5 min", "hoy", false),
    item("n2", "compite", "d2", 0, "hace 30 min", "hoy", false),
    item("n3", "termino", "d1", 1, "ayer · 4:40 p. m.", "antes", true),
    item("n4", "compite", "d1", 1, "ayer · 3:50 p. m.", "antes", true),
  ];
  const contexto = (n) => { const d = D.deportistaById(n.deportistaId); return { d, p: d.pruebas[n.idx], ev: D.evento("e1"), metodologo: D.metodologo.nombre }; };

  window.Alertas = {
    lista: ALERTAS,
    /* Bandeja: cada aviso con sus textos armados */
    bandeja() { return BANDEJA.map((n) => { const a = ALERTAS[n.tipo], c = contexto(n); return Object.assign({}, n, { tema: a.tema, icono: a.icono, tituloTxt: a.titulo(c), mensajeTxt: a.mensaje(c), nombre: c.d.nombre, accionTxt: a.accion || a.titulo(c), pruebaTxt: c.p.nombre + " · " + c.d.deporte, eventoTxt: c.ev.nombre, destino: a.destino === null ? null : "/deportista/" + n.deportistaId + "?evento=e1" }); }); },
    /* Demo web (recorrido): hace «llegar» un aviso nuevo a la bandeja, arriba y sin leer */
    llegar(tipo, deportistaId, idx) { const n = item("w" + Date.now(), tipo, deportistaId, idx || 0, "ahora", "hoy", false); BANDEJA.unshift(n); return n.id; },
    sinLeer() { return BANDEJA.filter((n) => !n.leida).length; },
    marcarLeida(id) { const n = BANDEJA.find((x) => x.id === id); if (n) n.leida = true; },
    marcarTodas() { BANDEJA.forEach((n) => { n.leida = true; }); },
    eliminar(id) { const i = BANDEJA.findIndex((x) => x.id === id); if (i >= 0) BANDEJA.splice(i, 1); },
    /* Aviso listo para pintar: parámetros + textos ya armados con el caso de muestra */
    aviso(id) { const a = ALERTAS[id] || ALERTAS.compite, c = ctx(); return Object.assign({}, a, { tituloTxt: a.titulo(c), mensajeTxt: a.mensaje(c) }); },
  };
})();
