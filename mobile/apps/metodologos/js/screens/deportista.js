/* Perfil del deportista / Perfil del deporte (lib/features/deportistas/presentation/pages/deportista_perfil_page.dart).
   Ruta #/deportista/:id (id de deportista, de equipo o de integrante: c1-m1).
   Contrato con la pantalla de evaluación (la implementa otro agente):
     - enlaces a  #/evaluacion/:deportistaId/:pruebaIndex[?modo=ver|editar]   (sin modo = crear; ver = solo lectura; editar = ver + intención de editar)
       pruebaIndex = posición de la prueba en deportista.pruebas.
     - al registrar una evaluación, la pantalla de evaluación puede avisar con
         PerfilRecientes.marcar(deportistaId, pruebaIndex, { fecha, evaluador, editableUntil })
       y el perfil pinta la prueba como Calificada con esa metadata (igual que _recienCalificadas de la app). */
(() => {
  "use strict";

  /* Iconos de Material que usa la página y que el registro no trae (viewBox 24) */
  Ui.registerIcon("m-home_outlined", '<svg viewBox="0 0 24 24"><path d="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" fill="currentColor"/></svg>');
  Ui.registerIcon("m-group_off_outlined", '<svg viewBox="0 0 24 24"><path d="M16.67 13.13C18.04 14.06 19 15.32 19 17v3h4v-3c0-2.18-3.57-3.47-6.33-3.87zM15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4c-.47 0-.91.1-1.33.24C14.5 5.27 15 6.58 15 8s-.5 2.73-1.33 3.76c.42.14.86.24 1.33.24zM9 12c2.21 0 4-1.79 4-4S11.21 4 9 4 5 5.79 5 8s1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 7c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm6 5H3v-.99C3.2 16.29 6.3 15 9 15s5.8 1.29 6 2v1z" fill="currentColor"/><path d="M3.41 2L2 3.41 20.59 22 22 20.59z" fill="currentColor"/></svg>');

  /* _recienCalificadas: en memoria, sobrevive a la navegación dentro de la sesión de la demo */
  const recientes = new Map();
  window.PerfilRecientes = window.PerfilRecientes || {
    marcar(id, idx, meta) { recientes.set(id + "|" + idx, meta || {}); },
    get(id, idx) { return recientes.get(id + "|" + idx) || null; },
  };

  const esc = Ui.esc;
  const dep = (id) => Data.deportistaById(id);
  /* Un integrante de equipo (informativo, sin calificar) = aparece en la lista de miembros de algún deportista.
     En la app lo marca el backend (esMiembroEquipo); la muestra de coc_sample no lo trae, se deduce de la pertenencia. */
  const esMiembro = (d) => d.esMiembroEquipo || Data.deportistas.some((t) => t.miembros.some((m) => m.id === d.id));

  /* Estado de una prueba. La muestra no trae alreadyEvaluated/evaluable (el backend sí): estado "calificado" => ya evaluada;
     sin motivo de bloqueo => evaluable. */
  const calificada = (d, i) => { const p = d.pruebas[i]; return p.alreadyEvaluated || p.estado === "calificado" || !!PerfilRecientes.get(d.id, i); };
  const evaluable = (p) => p.evaluable || !p.blockedReason;
  const puedeEditar = (d, i) => d.pruebas[i].editable || !!PerfilRecientes.get(d.id, i);
  const conMeta = (d, i) => { const r = PerfilRecientes.get(d.id, i); const p = d.pruebas[i]; return r ? Object.assign({}, p, { fecha: r.fecha || p.fecha, evaluador: r.evaluador || p.evaluador }) : p; };
  const estadoEfectivo = (d) => !d.pruebas.length ? d.estado : (d.pruebas.every((_, i) => calificada(d, i)) ? "calificado" : "sinCalificacion");
  const url = (d, i, modo) => "#/evaluacion/" + encodeURIComponent(d.id) + "/" + i + (modo ? "?modo=" + modo : "");

  const gap = (k) => '<div class="pf-gap-' + k + '"></div>';
  const h2 = (t) => '<h2 class="t-h2" style="color:var(--negro)">' + esc(t) + "</h2>";

  function header(d) {
    const titulo = d.esEquipo ? d.deporte : d.nombre;
    const inicial = (d.esEquipo ? d.deporte : d.nombre) || "";
    return '<div class="pf-head" data-testid="perfil-header"><div class="pf-avatar" data-testid="perfil-avatar" aria-hidden="true"><span>' + esc(inicial.charAt(0).toUpperCase()) + "</span></div>" +
      '<div class="pf-head-txt"><h2 class="t-h2" style="color:var(--negro)" data-testid="perfil-nombre">' + esc(titulo) + "</h2>" +
      (d.colegio ? '<div class="pf-colegio">' + Ui.icon("m-home_outlined", { size: 16, color: "var(--gray-700)" }) + '<span class="t-body">' + esc(d.colegio) + "</span></div>" : "") +
      "</div></div>";
  }

  function infoDeportiva(d, miembro) {
    const tieneClasif = d.clasificacionFuncional && d.clasificacionFuncional !== "—";
    const val = (t) => esc(t);
    const cells = [
      ["Deporte", '<div class="pf-sportchip" data-testid="perfil-deporte-chip">' + Ui.icon(Data.deporteIcono(d.deporte), { size: 16, color: "var(--orange-600)" }) + '<span class="t-tag">' + esc(d.deporte) + "</span></div>", true, "perfil-info-deporte"],
      ["Tipo de deporte", val(d.tipo), false, "perfil-info-tipo"],
      [d.esEquipo ? "Género" : "Sexo", val(!d.sexo || !d.sexo.trim() ? "No registrado" : d.sexo), false, "perfil-info-sexo"],
    ];
    if (!miembro && tieneClasif) cells.push(["Clasificación funcional", val(d.clasificacionFuncional), false, "perfil-info-clasificacion"]);
    if (!miembro) cells.push(["Estado", '<span data-testid="perfil-estado">' + Ui.chip(estadoEfectivo(d)) + "</span>", true, "perfil-info-estado"]);
    let rows = "";
    for (let i = 0; i < cells.length; i += 2) {
      const par = cells.slice(i, i + 2);
      rows += '<div class="pf-irow">' + par.map((c) => '<div class="pf-ilabel t-body-small">' + esc(c[0]) + "</div>").join("") + (par.length < 2 ? "<div></div>" : "") +
        par.map((c) => '<div class="pf-ival t-body-small' + (c[2] ? " chipcell" : "") + '" data-testid="' + c[3] + '">' + c[1] + "</div>").join("") + "</div>";
    }
    return '<section class="pf-card" data-testid="perfil-info"><h3 class="t-subtitle pf-info-title">Info. Deportiva</h3><div class="pf-info-rows">' + rows + "</div></section>";
  }

  const ico = (n, s, c) => Ui.icon(n, { size: s, color: c });
  const iconBtn = (icon, label, href, testid) => '<a class="pf-iconbtn" href="' + esc(href) + '" aria-label="' + esc(label) + '" data-testid="' + testid + '">' + ico(icon, 20, "var(--orange-700)") + "</a>";
  const acciones = (d, i, sufijo) => '<div class="pf-acts">' + iconBtn("ojo-abierto", "Ver evaluación", url(d, i, "ver"), "perfil-ver" + sufijo) +
    (puedeEditar(d, i) ? iconBtn("lapiz", "Editar evaluación", url(d, i, "editar"), "perfil-editar" + sufijo) : "") + "</div>";

  const pruebaHeader = (p) => '<div class="pf-ph"><div class="t-caption cap">Prueba</div><b>' + esc(p.nombre) + "</b></div>";
  const metaRow = (icon, txt, color, two) => '<div class="pf-mrow' + (two ? " two" : "") + '"><span class="tx" style="color:' + color + '">' + esc(txt) + "</span>" + ico(icon, 14, "var(--gray-700)") + "</div>";
  const calificadoMeta = (p) => '<div class="pf-meta">' + (p.fecha ? metaRow("reloj", p.fecha, "var(--negro)", false) : "") + (p.evaluador ? metaRow("usuario", p.evaluador, "var(--gray-700)", true) : "") + "</div>";
  const bloqueado = (p, start, testid) => '<div class="pf-block' + (start ? " start" : "") + '" data-testid="' + testid + '"><b>' + esc(p.blockedReason || "No disponible") + "</b><span>No se puede calificar</span></div>";

  function pruebaCard(d, i) {
    const p = conMeta(d, i), cal = calificada(d, i), estado = cal ? "calificado" : "sinCalificacion", t = "perfil-prueba-" + i;
    if (cal) {
      return '<article class="pf-card pf-prueba" data-testid="' + t + '"><div class="pf-grid">' +
        '<div class="l top">' + pruebaHeader(p) + '</div><div class="top">' + calificadoMeta(p) + "</div>" +
        '<div class="l">' + Ui.chip(estado) + "</div>" + acciones(d, i, "-" + i) + "</div></article>";
    }
    return '<article class="pf-card row pf-prueba" data-testid="' + t + '"><div class="pf-flex1">' + pruebaHeader(p) + '<div class="chipgap" style="height:8px"></div>' + Ui.chip(estado) + "</div>" +
      '<div class="pf-cta">' + (evaluable(p) ? Ui.button({ title: "Iniciar formulario", variant: "primary", size: "small", fit: true, href: url(d, i), testid: "perfil-iniciar-" + i }) : bloqueado(p, false, "perfil-bloqueado-" + i)) + "</div></article>";
  }

  function individual(d) {
    return h2("Calificar deportista") + gap("s") +
      '<p class="t-body pf-intro">Diligencia la evaluación técnico-metodológica por cada prueba, compuesta por las calificaciones psicológica, táctica y técnica.</p>' + gap("m") +
      d.pruebas.map((_, i) => pruebaCard(d, i)).join("");
  }

  function calificarEnConjunto(d) {
    if (!d.pruebas.length) return "";
    const p = conMeta(d, 0);
    if (calificada(d, 0)) {
      const fila = (icon, txt) => '<div class="pf-mfila">' + ico(icon, 16, "var(--gray-700)") + '<span class="tx">' + esc(txt) + "</span></div>";
      return '<div class="pf-card row" data-testid="perfil-equipo-calificado"><div class="pf-flex1">' + (p.fecha ? fila("reloj", p.fecha) : "") + (p.evaluador ? fila("usuario", p.evaluador) : "") + "</div>" +
        '<div style="width:8px;flex:none"></div>' + acciones(d, 0, "-equipo") + "</div>";
    }
    if (evaluable(p)) return Ui.button({ title: "Calificar en conjunto", variant: "primary", href: url(d, 0), testid: "perfil-calificar-conjunto" });
    return '<div class="pf-card" data-testid="perfil-equipo-bloqueado">' + bloqueado(p, true, "perfil-bloqueado-equipo") + "</div>";
  }

  function equipo(d) {
    return h2("Calificar equipo") + gap("s") +
      '<p class="t-body pf-intro">Diligencia la evaluación técnico-metodológica del equipo. Es una sola calificación para todo el equipo.</p>' + gap("m") +
      calificarEnConjunto(d) + gap("l") + h2("Integrantes del equipo") + gap("s") +
      (!d.miembros.length
        ? '<div class="pf-empty" data-testid="perfil-integrantes-vacio">' + ico("m-group_off_outlined", 40, "var(--gray-400)") + "<p>El equipo se encuentra sin integrantes</p></div>"
        : '<div class="t-caption c-gray-700" data-testid="perfil-integrantes-nota">Informativos: la calificación es del equipo, no por integrante.</div>' + gap("12") +
          d.miembros.map((m) => '<a class="pf-miembro" href="#/deportista/' + esc(encodeURIComponent(m.id)) + '" data-testid="perfil-integrante-' + esc(m.id) + '"><b>' + esc(m.nombre) + "</b>" + ico("m-chevron_right", 24, "var(--orange-700)") + "</a>").join(""));
  }

  function miembroAviso() {
    return '<div class="pf-card pf-aviso" data-testid="perfil-aviso-miembro">' + ico("m-info_outline", 24, "var(--orange-700)") +
      '<p class="t-body">Este deportista se califica como parte del equipo ("Calificar en conjunto"); no se califica individualmente.</p></div>';
  }

  Router.add("/deportista/:id", {
    render(params) {
      const d = dep(params.id);
      if (!d) return Ui.page({ nav: "eventos", testid: "pantalla-deportista", body: Ui.empty("No encontramos al deportista", { icon: "m-search_off" }) });
      const miembro = esMiembro(d);
      const titulo = !miembro && d.esEquipo ? "Perfil del deporte" : "Perfil del deportista";
      const cuerpo = '<a class="pf-back" href="#/eventos" data-act="volver" data-testid="perfil-volver" aria-label="Volver">' + ico("m-chevron_left", 32, "var(--orange-700)") + "</a>" + gap("s") +
        '<h1 class="t-h1" style="color:var(--negro)" data-testid="perfil-titulo">' + titulo + "</h1>" + gap("m") + header(d) + gap("m") + infoDeportiva(d, miembro) + gap("l") +
        (miembro ? miembroAviso() : d.esEquipo ? equipo(d) : individual(d));
      return Ui.page({ nav: "eventos", testid: "pantalla-deportista", scroll: true, body: '<div class="pf" data-testid="perfil-contenido" data-es-equipo="' + (d.esEquipo && !miembro) + '">' + cuerpo + "</div>" });
    },
    mount(root, params) {
      const d = dep(params.id), ev = d && Data.eventoDeDeportista(d.id);
      Ui.on(root, "click", "[data-act=volver]", (e) => { e.preventDefault(); Router.back(ev ? "/evento/" + ev.id : "/eventos"); });
    },
  });
})();
