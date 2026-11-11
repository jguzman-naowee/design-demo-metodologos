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
  Ui.registerIcon("m-download", '<svg viewBox="0 0 24 24"><path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z" fill="currentColor"/></svg>');
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
  const esMiembro = (d) => d.esMiembroEquipo || !!Data.equipoDeMiembro(d.id);

  /* Estado de una prueba. La muestra no trae alreadyEvaluated/evaluable (el backend sí): estado "calificado" => ya evaluada;
     sin motivo de bloqueo => evaluable. */
  const calificada = (d, i) => { const p = d.pruebas[i]; return p.alreadyEvaluated || p.estado === "calificado" || !!PerfilRecientes.get(d.id, i); };
  const evaluable = (p) => p.evaluable || !p.blockedReason;
  const puedeEditar = (d, i) => d.pruebas[i].editable || !!PerfilRecientes.get(d.id, i);
  const conMeta = (d, i) => { const r = PerfilRecientes.get(d.id, i); const p = d.pruebas[i]; return r ? Object.assign({}, p, { fecha: r.fecha || p.fecha, evaluador: r.evaluador || p.evaluador }) : p; };
  const estadoEfectivo = (d) => !d.pruebas.length ? d.estado : (d.pruebas.every((_, i) => calificada(d, i)) ? "calificado" : "sinCalificacion");
  const url = (d, i, modo) => "#/evaluacion/" + encodeURIComponent(d.id) + "/" + i + (modo ? "?modo=" + modo : "");

  const gap = (k) => '<div class="pf-gap-' + k + '"></div>';
  /* Títulos de sección del perfil: 20px (--fs-subtitle), un escalón bajo el h2 de 22px */
  const h2 = (t) => '<h2 class="t-subtitle" style="color:var(--negro)">' + esc(t) + "</h2>";

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
  /* Una sola acción por evaluación: «Editar» mientras el plazo siga abierto; «Ver» (solo lectura) cuando ya no se puede editar. */
  const acciones = (d, i, sufijo, soloVer) => '<div class="pf-acts">' + (!soloVer && puedeEditar(d, i)
    ? iconBtn("lapiz", "Editar evaluación", url(d, i, "editar"), "perfil-editar" + sufijo)
    : iconBtn("ojo-abierto", "Ver evaluación", url(d, i, "ver"), "perfil-ver" + sufijo)) + "</div>";

  const pruebaHeader = (p) => '<div class="pf-ph"><div class="t-caption cap">Prueba</div><b>' + esc(p.nombre) + "</b></div>";
  const metaRow = (icon, txt, color, two) => '<div class="pf-mrow' + (two ? " two" : "") + '"><span class="tx" style="color:' + color + '">' + esc(txt) + "</span>" + ico(icon, 14, "var(--gray-700)") + "</div>";
  const calificadoMeta = (p) => '<div class="pf-meta">' + (p.fecha ? metaRow("reloj", p.fecha, "var(--negro)", false) : "") + (p.evaluador ? metaRow("usuario", p.evaluador, "var(--gray-700)", true) : "") + "</div>";
  const bloqueado = (p, start, testid) => '<div class="pf-block' + (start ? " start" : "") + '" data-testid="' + testid + '"><b>' + esc(p.blockedReason || "No disponible") + "</b><span>No se puede calificar</span></div>";

  /* Card compacta de una prueba ya calificada: nombre (+ chip solo en «Calificar»), fecha, evaluador y plazo; ver/editar a la derecha.
     En el historial no lleva chip: estar ahí ya significa «Calificado». */
  function plazoTexto(d, i) {
    const r = PerfilRecientes.get(d.id, i), op = Evaluaciones.get(d.id, i);
    const hasta = (r && r.editableUntil) || (op && op.editableUntil) || "";
    if (!hasta) return "";
    return puedeEditar(d, i) ? "Editable hasta el " + Data.fechaLarga(hasta) : "El plazo de edición terminó el " + Data.fechaLarga(hasta);
  }
  function calificadaCard(d, i, conChip, soloVer) {
    const p = conMeta(d, i), plazo = soloVer ? "" : plazoTexto(d, i);
    /* Solo lectura (integrante de equipo): si aún se puede editar, el aviso va en la propia card y manda a editar desde el perfil del deporte; si no, no dice nada */
    const plazoEquipo = soloVer && puedeEditar(d, i) ? plazoTexto(d, i) : "";
    const fila = (icon, txt) => '<span class="pf-cmrow">' + ico(icon, 16, "var(--gray-700)") + '<span class="tx">' + esc(txt) + "</span></span>";
    return '<article class="pf-ccard" data-testid="perfil-prueba-' + i + '"><div class="pf-cmain"><div class="pf-ctitle"><b>' + esc(p.nombre) + "</b>" + (conChip ? Ui.chip("calificado") : "") + "</div>" +
      '<div class="pf-cmeta">' + (p.fecha ? fila("reloj", p.fecha) : "") + (p.evaluador ? fila("usuario", p.evaluador) : "") +
      (plazo ? Ui.alertaMute(puedeEditar(d, i) ? "informative" : "negative", esc(plazo), "perfil-plazo-" + i) : "") +
      (plazoEquipo ? Ui.alertaMute("informative", esc(plazoEquipo) + '. Hazlo desde el <a href="#/deportista/' + esc(encodeURIComponent(d.id)) + '" data-testid="perfil-ir-equipo-' + i + '">perfil del deporte</a>.', "perfil-plazo-" + i) : "") + "</div></div>" +
      acciones(d, i, "-" + i, soloVer) + "</article>";
  }

  function pruebaCard(d, i, enHistorial, soloVer) {
    const p = conMeta(d, i), cal = calificada(d, i), estado = cal ? "calificado" : "sinCalificacion", t = "perfil-prueba-" + i;
    if (cal) return calificadaCard(d, i, !enHistorial, soloVer);
    return '<article class="pf-card row pf-prueba" data-testid="' + t + '"><div class="pf-flex1">' + pruebaHeader(p) + '<div class="chipgap" style="height:8px"></div>' + Ui.chip(estado) + "</div>" +
      '<div class="pf-cta">' + (evaluable(p) ? Ui.button({ title: "Iniciar formulario", variant: "primary", size: "small", fit: true, href: url(d, i), testid: "perfil-iniciar-" + i }) : bloqueado(p, false, "perfil-bloqueado-" + i)) + "</div></article>";
  }

  /* Pestañas del perfil individual: «Calificar» (pendientes y evaluaciones aún editables) e «Historial» (todas las completadas). */
  const TABS = [["calificar", "Calificar"], ["historial", "Historial"]];
  const tabsHtml = () => '<div class="tabs" role="tablist" data-testid="perfil-tabs">' + TABS.map((t, i) =>
    '<button type="button" role="tab" class="tab' + (i ? "" : " on") + '" aria-selected="' + (i ? "false" : "true") + '" data-tab="' + i + '" data-testid="perfil-tab-' + t[0] + '"><span class="tab-in"><span class="tab-txt">' + t[1] + '</span><span class="tab-bar"></span></span></button>').join("") + '<span class="pf-tabind" aria-hidden="true"></span></div>';

  /* Agrupa índices de pruebas por evento (en curso primero, luego el resto en el orden de Data.eventos): [{ ev, idx }] */
  function agruparPorEvento(d, idx) {
    const ids = [...new Set(idx.map((i) => d.pruebas[i].eventoId || "e1"))];
    const rank = (e) => (e.estado === "enCurso" ? 0 : 1) * 100 + Data.eventos.indexOf(e);
    return ids.map((id) => Data.evento(id)).filter(Boolean).sort((x, y) => rank(x) - rank(y))
      .map((ev) => ({ ev, idx: idx.filter((i) => (d.pruebas[i].eventoId || "e1") === ev.id) }));
  }

  function porEvento(d, idx, siempre, soloVer) {
    const grupos = agruparPorEvento(d, idx);
    return grupos.map(({ ev: e, idx: ids }) => {
      const cards = ids.map((i) => pruebaCard(d, i, true, soloVer)).join("");
      const head = siempre || grupos.length > 1
        ? '<div class="pf-evgrupo" data-testid="perfil-evento-' + esc(e.id) + '"><span class="t-caption nm">' + esc(e.nombre) + "</span>" + Ui.chip(e.estado) + "</div>" : "";
      return head + cards;
    }).join("");
  }

  /* Descarga del historial: un .xlsx con una fila por evaluación completada, de todos los eventos del ciclo. */
  const completadas = (d) => d.pruebas.map((_, i) => i).filter((i) => calificada(d, i));
  /* d: quien se consulta. equipo (opcional): si d es integrante, el historial es el del equipo y d solo se anota como quien consulta. */
  function descargarHistorial(d, equipo) {
    const T = (v) => ({ v, s: "texto" }), src = equipo || d;
    const filas = [
      [{ v: "Historial de evaluaciones", s: "titulo" }],
      equipo ? [{ v: "Equipo", s: "negrita" }, src.nombre] : [{ v: "Deportista", s: "negrita" }, src.nombre],
      equipo ? [{ v: "Integrante consultado", s: "negrita" }, d.nombre] : [],
      [{ v: "Deporte", s: "negrita" }, src.deporte],
      [{ v: "Categoría", s: "negrita" }, src.categoria],
      [{ v: "Colegio o institución", s: "negrita" }, src.colegio],
      [{ v: "Generado", s: "negrita" }, Evaluaciones.formatFechaHora(new Date()) + " · " + (Data.metodologo ? Data.metodologo.nombre : "")],
      [],
      ["Evento", "Estado del evento", "Prueba", "Fecha de evaluación", "Evaluador", "Plazo de edición", "Países en la prueba", "N.º de atletas", "Aspecto técnico", "Aspecto táctico", "Preparación física", "Conclusiones", "Recomendaciones"].map((v) => ({ v, s: "encabezado" })),
    ];
    agruparPorEvento(src, completadas(src)).forEach(({ ev, idx }) => idx.forEach((i) => {
      const p = conMeta(src, i), op = Evaluaciones.get(src.id, i) || {};
      filas.push([T(ev.nombre), ev.estadoLabel, T(p.nombre), p.fecha || "", T(p.evaluador || ""), T(plazoTexto(src, i)), T(op.countries || ""), typeof op.athletesCount === "number" ? op.athletesCount : (op.athletesCount || ""), T(op.technicalAspect || ""), T(op.tacticalAspect || ""), T(op.physicalPreparation || ""), T(op.conclusions || ""), T(op.recommendations || "")]);
    }));
    const slug = Data.norm(src.nombre).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    Xlsx.descargar("historial-evaluaciones-" + slug + ".xlsx", { hoja: "Historial", columnas: [34, 16, 22, 24, 26, 36, 24, 12, 48, 48, 48, 48, 48], filas });
    Ui.toast("El archivo quedó en tu dispositivo.", "success", 3500, "Historial descargado");
  }

  function panelCalificar(d, evId) {
    const idx = d.pruebas.map((_, i) => i).filter((i) => (d.pruebas[i].eventoId || "e1") === evId && (!calificada(d, i) || puedeEditar(d, i)));
    return h2("Calificar deportista") + gap("s") +
      '<p class="t-body pf-intro">Diligencia la evaluación técnico-metodológica por cada prueba, compuesta por las calificaciones psicológica, táctica y técnica.</p>' + gap("m") +
      (idx.length ? idx.map((i) => pruebaCard(d, i)).join("") : '<div class="pf-empty" data-testid="perfil-calificar-vacio">' + ico("m-info_outline", 40, "var(--gray-400)") + "<p>No hay evaluaciones pendientes. Las completadas están en el historial.</p></div>");
  }

  function panelHistorial(d) {
    const idx = d.pruebas.map((_, i) => i).filter((i) => calificada(d, i));
    return h2("Historial de evaluaciones") + gap("s") +
      '<p class="t-body pf-intro">Evaluaciones completadas a este deportista a lo largo de los eventos del ciclo.</p>' + gap("m") +
      (idx.length ? Ui.button({ title: "Descargar historial", variant: "cream-outlined", leftIcon: "m-download", act: "descargar-historial", testid: "perfil-descargar-historial" }) + gap("m") : "") +
      (idx.length
        ? '<div data-testid="perfil-historial-lista">' + porEvento(d, idx, true) + "</div>"
        : '<div class="pf-empty" data-testid="perfil-historial-vacio">' + ico("m-info_outline", 40, "var(--gray-400)") + "<p>Aún no hay evaluaciones completadas.</p></div>");
  }

  const individual = (d, evId) => tabsHtml() + gap("m") + '<div data-panel>' + panelCalificar(d, evId) + "</div>";

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

  /* Integrante de un equipo: solo ve el historial de evaluaciones del equipo (nunca las edita desde aquí). */
  function historialMiembro(m) {
    const t = Data.equipoDeMiembro(m.id);
    if (!t) return "";
    const idx = completadas(t);
    return gap("l") + h2("Historial de evaluaciones") + gap("s") +
      '<p class="t-body pf-intro">Evaluaciones completadas al equipo a lo largo de los eventos del ciclo.</p>' + gap("m") +
      (idx.length
        ? Ui.button({ title: "Descargar historial", variant: "cream-outlined", leftIcon: "m-download", act: "descargar-historial", testid: "perfil-descargar-historial" }) + gap("m") + '<div data-testid="perfil-historial-lista">' + porEvento(t, idx, true, true) + "</div>"
        : '<div class="pf-empty" data-testid="perfil-historial-vacio">' + ico("m-info_outline", 40, "var(--gray-400)") + "<p>El equipo aún no tiene evaluaciones completadas.</p></div>");
  }

  function miembroAviso() {
    return '<div class="pf-card pf-aviso" data-testid="perfil-aviso-miembro">' + ico("m-info_outline", 24, "var(--orange-700)") +
      '<p class="t-body">Este deportista se califica como parte del equipo ("Calificar en conjunto"); no se califica individualmente.</p></div>';
  }

  /* Evento por el que se llegó (?evento=); sin él, el primero que contiene al deportista. */
  const eventoActual = (d, ctx) => { const e = ctx && ctx.query && Data.evento(ctx.query.evento); return (e || Data.eventoDeDeportista(d.id) || {}).id || "e1"; };

  Router.add("/deportista/:id", {
    render(params, ctx) {
      const d = dep(params.id);
      if (!d) return Ui.page({ nav: "eventos", testid: "pantalla-deportista", body: Ui.empty("No encontramos al deportista", { icon: "m-search_off" }) });
      const miembro = esMiembro(d);
      const titulo = !miembro && d.esEquipo ? "Perfil del deporte" : "Perfil del deportista";
      const cuerpo = '<div class="pf-titlerow fija a-sangre" data-testid="perfil-barra"><a class="backlink" href="#/eventos" data-act="volver" data-testid="perfil-volver" aria-label="Volver">' + ico("m-chevron_left", 32, "var(--orange-700)") + "</a>" +
        '<h1 class="t-h1" style="color:var(--negro)" data-testid="perfil-titulo">' + titulo + "</h1></div>" + gap("m") + header(d) + gap("m") + infoDeportiva(d, miembro) + gap("l") +
        (miembro ? miembroAviso() + historialMiembro(d) : d.esEquipo ? equipo(d) : individual(d, eventoActual(d, ctx)));
      return Ui.page({ nav: "eventos", testid: "pantalla-deportista", scroll: true, body: '<div class="pf" data-testid="perfil-contenido" data-es-equipo="' + (d.esEquipo && !miembro) + '">' + cuerpo + "</div>" });
    },
    mount(root, params, ctx) {
      const d = dep(params.id), ev = d && Data.evento(eventoActual(d, ctx));
      /* DC-039: una sola barra fija; con scroll solo gana sombra y su texto pasa a «Perfil de <nombre>» (arriba no muestra el nombre) */
      const scroller = root.querySelector(".page-body"), barra = root.querySelector(".pf-titlerow"), h1 = root.querySelector("[data-testid=perfil-titulo]");
      if (d && scroller && barra && h1) {
        const arriba = h1.textContent, abajo = "Perfil de " + (!esMiembro(d) && d.esEquipo ? d.deporte : d.nombre);
        const sombra = Ui.fijar(scroller, barra);
        const texto = () => { h1.textContent = barra.classList.contains("pegada") ? abajo : arriba; };
        scroller.addEventListener("scroll", texto, { passive: true }); texto();
      }
      /* Subrayado deslizante bajo la pestaña activa (mide el texto de la pestaña) */
      const ind = root.querySelector(".pf-tabind");
      const moverInd = (t, animar) => {
        if (!ind || !t) return;
        const tin = t.querySelector(".tab-in"), caja = t.parentElement.getBoundingClientRect(), r = tin.getBoundingClientRect();
        ind.classList.toggle("sin-anim", !animar);
        ind.style.width = r.width + "px";
        ind.style.transform = "translateX(" + (r.left - caja.left) + "px)";
      };
      const activa = () => root.querySelector(".tab.on");
      requestAnimationFrame(() => moverInd(activa(), false));
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => moverInd(activa(), false));
      window.addEventListener("resize", () => moverInd(activa(), false));
      const sinMovimiento = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
      Ui.on(root, "click", ".tab", (e, t) => {
        const panel = root.querySelector("[data-panel]"); if (!d || !panel) return;
        const i = +t.dataset.tab;
        if (t.classList.contains("on")) return;
        root.querySelectorAll(".tab").forEach((x) => { const on = x === t; x.classList.toggle("on", on); x.setAttribute("aria-selected", String(on)); });
        moverInd(t, true);
        panel.innerHTML = i ? panelHistorial(d) : panelCalificar(d, eventoActual(d, ctx));
        /* Entrada suave del contenido nuevo */
        if (!sinMovimiento && panel.animate) panel.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 220, easing: "ease-out" });
      });
      Ui.on(root, "click", "[data-act=descargar-historial]", () => { if (!d) return; const eq = esMiembro(d) ? Data.equipoDeMiembro(d.id) : null; descargarHistorial(d, eq); });
      Ui.on(root, "click", "[data-act=volver]", (e) => { e.preventDefault(); Router.back(ev ? "/evento/" + ev.id : "/eventos"); });
    },
  });
})();
