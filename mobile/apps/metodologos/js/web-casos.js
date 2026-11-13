/* Recorrido de la demo en la versión web: el mismo reproductor de casos del marco móvil (mobile/mobile.js), pero sobre la propia página.
   No achica la pantalla: el botón «Casos» abre un panel flotante a la derecha (overlay) con la lista de historias, el detalle de cada una
   y los controles (paso a paso / automático). El recuadro y el cursor se dibujan encima de la app real.
   Un paso «goto» recarga la página (como el marco recarga el iframe) para que cada caso parta limpio; el estado del reproductor
   (caso, paso, modo, panel abierto) sobrevive a la recarga en sessionStorage y se retoma solo. Datos: casos.js, casos-detalle.js, casos-web.js. */
(() => {
  "use strict";
  if (!window.CASOS) return;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const KEY = "metodologos.casosWeb";
  const S = { open: false, caso: null, i: 0, mode: "paso", token: 0, busy: false, stopped: false, fresh: false, fxEl: null, fxClick: false };

  /* Los pasos de web.js/casos-web.js sustituyen a los del móvil cuando la pantalla web es distinta (otro botón, otra tabla). */
  const CASOS = window.CASOS.map((c) => Object.assign({}, c, (window.CASOS_WEB || {})[c.id] || {})).filter((c) => !c.soloMovil);
  const DET = window.CASOS_DETALLE || {};

  const guardar = () => { try { sessionStorage.setItem(KEY, JSON.stringify({ id: S.caso && S.caso.id, i: S.i, mode: S.mode, open: S.open, fresh: S.fresh, y: lista ? lista.scrollTop : 0 })); } catch (e) { /* sin almacenamiento */ } };
  const leer = () => { try { return JSON.parse(sessionStorage.getItem(KEY) || "null"); } catch (e) { return null; } };

  /* ── DOM ── */
  const panel = document.createElement("aside");
  panel.className = "wc"; panel.id = "wc-panel"; panel.hidden = true; panel.setAttribute("aria-label", "Recorrido de la demo"); panel.setAttribute("data-testid", "casos-panel");
  panel.innerHTML =
    '<header class="wc-hd"><span class="wc-k">Casos</span>' +
      '<button type="button" class="wc-x" data-testid="casos-cerrar" aria-label="Cerrar el panel de casos"><svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M5 5l10 10M15 5 5 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button></header>' +
    '<ol class="wc-lista" data-testid="casos-lista"></ol>' +
    '<article class="wc-det" hidden aria-label="Detalle del caso"></article>' +
    '';
  const flota = document.createElement("section");
  flota.className = "wc-flota"; flota.hidden = true; flota.setAttribute("aria-label", "Caso en curso"); flota.setAttribute("data-testid", "casos-flota");
  flota.innerHTML =
    '<button type="button" class="wc-x wc-fx" data-act="flota-cerrar" data-testid="casos-flota-cerrar" aria-label="Terminar el recorrido" title="Terminar el recorrido"><svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M5 5l10 10M15 5 5 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button><div class="wc-say" aria-live="polite" data-testid="casos-texto"></div>' +
    '<div class="wc-ctrl"><div class="wc-cnt" role="progressbar" aria-label="Avance del caso"></div>' +
      '<div class="wc-seg" role="group" aria-label="Modo"><button type="button" data-mode="paso" class="on">Paso a paso</button>' +
      '<button type="button" data-mode="auto" class="ic" aria-label="Automático" title="Automático"><svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M6 4.5v11l9-5.5z" fill="currentColor"/></svg></button></div>' +
      '<button type="button" class="wc-b ghost ic" data-act="reiniciar" aria-label="Reiniciar el caso" title="Reiniciar el caso"><svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="M4.5 10a5.5 5.5 0 1 0 1.8-4.07M4 3.5v3.2h3.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
      '<button type="button" class="wc-b ghost ic" data-act="detener" aria-label="Detener la ejecución" title="Detener la ejecución" disabled><svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><rect x="4.5" y="4.5" width="11" height="11" rx="2" fill="currentColor"/></svg></button>' +
      '<button type="button" class="wc-b" data-act="siguiente" data-testid="casos-siguiente">Siguiente ▸</button></div>';
  const velo = document.createElement("div"); velo.className = "wc-velo"; velo.hidden = true;
  const spot = document.createElement("div"); spot.className = "wc-spot"; spot.hidden = true;
  const cur = document.createElement("div"); cur.className = "wc-cursor"; cur.hidden = true;
  const lanzador = document.createElement("button"); /* solo si la pantalla no tiene cabecera (inicio de sesión) */
  lanzador.type = "button"; lanzador.className = "wc-lanza"; lanzador.hidden = true; lanzador.setAttribute("data-testid", "casos-lanzador");
  lanzador.innerHTML = '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M3 5h14M3 10h14M3 15h14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><span>Casos</span>';
  document.body.append(velo, panel, flota, spot, cur, lanzador);
  const lista = panel.querySelector(".wc-lista"), det = panel.querySelector(".wc-det"), say = flota.querySelector(".wc-say"), cnt = flota.querySelector(".wc-cnt");
  const btnNext = flota.querySelector("[data-act=siguiente]"), btnStop = flota.querySelector("[data-act=detener]");

  /* ── Lista de casos (agrupada como en el marco) ── */
  const fila = (c) => c.noAplica
    ? '<li class="wc-fila"><button type="button" class="wc-case wc-off" disabled aria-disabled="true" data-id="' + esc(c.id) + '" data-testid="caso-' + esc(c.id) + '"><b>' + esc(c.id) + "</b><span>" + esc(c.titulo) + "<small>" + esc(c.noAplica) + "</small></span></button></li>"
    : '<li class="wc-fila"><button type="button" class="wc-case" data-id="' + esc(c.id) + '" data-testid="caso-' + esc(c.id) + '"><b>' + esc(c.id) + "</b><span>" + esc(c.titulo) + "</span></button>" +
    (DET[c.id] ? '<button type="button" class="wc-ver" data-id="' + esc(c.id) + '" aria-label="Ver detalle de ' + esc(c.titulo) + '" title="Ver detalle">›</button>' : "") + "</li>";
  const pintarLista = () => {
    const gs = window.CASOS_GRUPOS, porId = (i) => CASOS.find((c) => c.id === i);
    if (!gs) { lista.innerHTML = CASOS.map(fila).join(""); return; }
    const tomados = new Set(gs.flatMap((g) => g.ids || []));
    lista.innerHTML = gs.map((g) => {
      const cs = g.resto ? CASOS.filter((c) => !tomados.has(c.id)) : g.ids.map(porId).filter(Boolean);
      if (!cs.length) return "";
      const enlace = g.url ? ' <a href="' + esc(g.url) + '" target="_blank" rel="noopener">' + esc(g.ref) + " ↗</a>" : "";
      return '<li class="wc-grp"><span class="wc-k">' + esc(g.titulo) + "</span>" + enlace + (g.nota ? "<small>" + esc(g.nota) + "</small>" : "") + "</li>" + cs.map(fila).join("");
    }).join("");
  };

  /* ── Reproductor ── */
  const aUrl = (u) => { /* «index.html?sesion=1#/x» del móvil → la misma página web con un parámetro único (un cambio solo de #hash no recarga) */
    const [a, h] = (u || "").split("#"), q = (a.split("?")[1] || "");
    return location.pathname + "?" + (q ? q + "&" : "") + "_r=" + Date.now() + (h != null ? "#" + h : "");
  };
  const rectOf = (el) => el.getBoundingClientRect();
  const find = async (sel) => {
    let el = document.querySelector(sel);
    for (let n = 0; !el && n < 30; n++) { await sleep(100); el = document.querySelector(sel); }
    if (!el) throw new Error("No se encontró «" + sel + "» en la pantalla.");
    return el;
  };
  const colocar = (r) => { const p = 6; Object.assign(spot.style, { left: r.left - p + "px", top: r.top - p + "px", width: r.width + 2 * p + "px", height: r.height + 2 * p + "px" }); };
  const focus = async (el) => {
    el.scrollIntoView({ block: "center", behavior: RM ? "auto" : "smooth" });
    await sleep(RM ? 0 : 350);
    let r = rectOf(el);
    for (let n = 0; !RM && n < 10; n++) { await sleep(60); const r2 = rectOf(el); const quieto = Math.abs(r2.left - r.left) < 1 && Math.abs(r2.top - r.top) < 1 && Math.abs(r2.width - r.width) < 1 && Math.abs(r2.height - r.height) < 1; r = r2; if (quieto) break; }
    colocar(r); spot.hidden = false; velo.classList.add("off"); S.fxEl = el; S.fxClick = false;
    return r;
  };
  const hideFx = () => { S.fxEl = null; velo.classList.remove("off"); spot.hidden = true; cur.hidden = true; spot.classList.remove("hint"); };
  const ponCursor = (r) => { cur.style.transform = "translate(" + (r.left + r.width / 2) + "px," + (r.top + r.height / 2) + "px)"; };
  const realinear = () => { const el = S.fxEl; if (!el || spot.hidden) return; if (!document.contains(el)) return hideFx(); const r = rectOf(el); colocar(r); if (S.fxClick && !cur.hidden) ponCursor(r); };
  let raf = 0; const pedir = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; realinear(); }); };
  addEventListener("scroll", pedir, true); addEventListener("resize", pedir);

  async function hint() {
    const st = S.caso && S.caso.steps[S.i];
    if (S.mode !== "paso" || S.busy || !st || st.t === "goto" || !st.sel) return;
    const my = S.token;
    try {
      let el = document.querySelector(st.sel);
      for (let n = 0; !el && n < 10; n++) { await sleep(150); if (my !== S.token || S.busy || S.mode !== "paso") return; el = document.querySelector(st.sel); }
      if (!el) return;
      const r = await focus(el);
      if (my !== S.token || S.busy || S.mode !== "paso") return;
      spot.classList.add("hint");
      if (st.t === "click") { S.fxClick = true; cur.hidden = false; ponCursor(r); }
    } catch (e) { /* sin guía: el paso mostrará su error al ejecutarse */ }
  }

  async function runStep(st) {
    if (st.t === "goto") {
      hideFx();
      if (S.fresh) { S.fresh = false; return; } /* la página ya se cargó limpia para este caso */
      S.i++; S.fresh = false; guardar(); S.i--; /* se retoma en el paso siguiente tras la recarga */
      location.replace(aUrl(st.url || ""));
      await new Promise(() => {}); /* la página se descarga */
    }
    if (st.t === "aviso") { hideFx(); window.Alertas.llegar(st.tipo, st.d, st.idx || 0); if (window.Ui && Ui.actualizarCampana) Ui.actualizarCampana(); await sleep(RM ? 0 : 500); return; }
    const el = await find(st.sel), r = await focus(el);
    if (st.t === "click") {
      S.fxClick = true; cur.hidden = false; ponCursor(r);
      await sleep(RM ? 0 : 650);
      cur.classList.add("press"); await sleep(RM ? 0 : 300); cur.classList.remove("press");
      el.click(); hideFx();
      await sleep(RM ? 0 : 400);
    }
  }

  const paint = () => {
    if (!S.caso) return;
    flota.hidden = S.open;
    const n = S.caso.steps.length, hecho = Math.min(S.i, n);
    cnt.hidden = false;
    cnt.innerHTML = Array.from({ length: n }, (_, k) => "<i" + (k < hecho ? ' class="on"' : "") + "></i>").join("");
    cnt.setAttribute("aria-valuemin", 0); cnt.setAttribute("aria-valuemax", n); cnt.setAttribute("aria-valuenow", hecho);
    btnNext.textContent = (S.i >= n ? "Terminado" : "Siguiente") + " ▸";
    btnNext.disabled = S.i >= n || S.busy;
    btnStop.disabled = !(S.busy || S.mode === "auto");
    panel.querySelectorAll(".wc-case").forEach((b) => b.classList.toggle("on", b.dataset.id === S.caso.id));
    flota.querySelectorAll(".wc-seg button").forEach((x) => x.classList.toggle("on", x.dataset.mode === S.mode));
    /* texto del paso ya hecho (el del último paso ejecutado) */
    const ult = S.caso.steps[S.i - 1];
    if (ult && ult.body && !say.dataset.err) say.textContent = ult.body;
    if (!S.i) say.textContent = S.caso.titulo;
    guardar();
  };

  async function next() {
    if (!S.caso || S.busy || S.i >= S.caso.steps.length) return;
    const my = S.token; S.busy = true; say.dataset.err = ""; paint();
    try { await runStep(S.caso.steps[S.i]); S.i++; }
    catch (e) { say.dataset.err = "1"; say.innerHTML = '<b class="wc-err">' + esc(e.message) + "</b>"; hideFx(); }
    S.busy = false; paint();
    if (S.i >= S.caso.steps.length) { setTimeout(hideFx, RM ? 0 : 1200); const fin = S.caso, esp = fin.falta ? 6000 : 2600; setTimeout(() => { if (S.caso === fin && S.i >= fin.steps.length) terminar(); }, RM ? 1500 : esp); } /* al acabar el recorrido se cierra la tarjeta y se quita el velo */
    if (S.i >= S.caso.steps.length && S.caso.falta) say.innerHTML += '<span class="wc-falta"><b>Pendiente:</b> ' + esc(S.caso.falta) + "</span>";
    if (S.mode === "paso" && (my === S.token || S.stopped)) { S.stopped = false; hint(); }
    if (S.mode === "auto" && my === S.token && S.i < S.caso.steps.length) { await sleep(RM ? 0 : 1400); if (my === S.token) next(); }
  }
  function stop() { S.token++; S.stopped = S.busy; S.mode = "paso"; paint(); if (!S.busy) hint(); }

  /* Elegir un caso: la página se recarga limpia en su punto de partida (sesión iniciada o no, según el caso) y el panel sigue abierto. */
  function pick(id) {
    S.token++; S.stopped = false; S.busy = false; S.i = 0; hideFx();
    S.caso = CASOS.find((c) => c.id === id) || CASOS[0];
    const g = S.caso.steps[0];
    S.fresh = true; S.open = false; panel.hidden = true; velo.hidden = true; document.documentElement.classList.remove("wc-abierto");
    document.querySelectorAll("[data-act=casos]").forEach((b) => b.setAttribute("aria-expanded", "false")); guardar();
    say.dataset.err = ""; say.textContent = S.caso.titulo;
    location.replace(aUrl((g && g.t === "goto" && g.url) || ""));
  }

  /* ── Detalle del caso ── */
  const inline = (t) => esc(t).replace(/`([^`]+)`/g, "<code>$1</code>");
  function abrirDetalle(id) {
    const c = CASOS.find((x) => x.id === id), d = DET[id];
    if (!c || !d) return;
    const sec = (d.secciones || []).filter((s) => s.items && s.items.length).map((s) => {
      const t = s.titulo === "Cómo se hace" ? "ol" : "ul";
      return "<section><h3>" + esc(s.titulo) + "</h3><" + t + ">" + s.items.map((i) => "<li>" + inline(i) + "</li>").join("") + "</" + t + "></section>";
    }).join("");
    det.innerHTML = '<div class="wc-dh"><button type="button" class="wc-x" data-act="det-volver" aria-label="Volver a la lista de casos">‹</button><b>' + esc(c.id) + "</b></div>" +
      "<h2>" + esc(c.titulo) + '</h2><button type="button" class="wc-b" data-act="det-play" data-testid="caso-reproducir"><span aria-hidden="true">▶</span> Reproducir caso</button>' +
      (d.resumen ? '<p class="wc-res">' + inline(d.resumen) + "</p>" : "") + sec;
    lista.hidden = true; det.hidden = false; det.scrollTop = 0; det.dataset.id = id;
  }
  const cerrarDetalle = () => { det.hidden = true; lista.hidden = false; };

  /* ── Abrir / cerrar ── */
  function setOpen(v) {
    S.open = v; panel.hidden = !v; velo.hidden = !v; document.documentElement.classList.toggle("wc-abierto", v);
    document.querySelectorAll("[data-act=casos]").forEach((b) => b.setAttribute("aria-expanded", String(v)));
    if (v) { hideFx(); flota.hidden = true; } else if (S.caso) { paint(); hint(); }
    guardar();
  }
  window.WebCasos = { toggle: () => setOpen(!S.open), open: () => setOpen(true), close: () => setOpen(false) };

  document.addEventListener("click", (e) => { if (e.target.closest("[data-act=casos]")) { e.preventDefault(); setOpen(!S.open); } });
  const terminar = () => { S.token++; S.busy = false; S.caso = null; S.i = 0; S.mode = "paso"; hideFx(); flota.hidden = true; panel.querySelectorAll(".wc-case").forEach((b) => b.classList.remove("on")); guardar(); };
  const alClic = (e) => {
    const t = e.target;
    if (t.closest("[data-act=flota-cerrar]")) return terminar();
    if (t.closest(".wc-x[data-testid=casos-cerrar]")) return setOpen(false);
    if (t.closest("[data-act=det-volver]")) return cerrarDetalle();
    if (t.closest("[data-act=det-play]")) { S.mode = "auto"; return pick(det.dataset.id); }
    const v = t.closest(".wc-ver"); if (v) return abrirDetalle(v.dataset.id);
    const c = t.closest(".wc-case"); if (c) return pick(c.dataset.id);
    if (t.closest("[data-act=siguiente]")) return next();
    if (t.closest("[data-act=detener]")) return stop();
    if (t.closest("[data-act=reiniciar]")) return S.caso && pick(S.caso.id);
    const m = t.closest(".wc-seg button");
    if (m) { S.mode = m.dataset.mode; paint(); if (S.mode === "auto") next(); else hint(); }
  };
  panel.addEventListener("click", alClic); flota.addEventListener("click", alClic);
  panel.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  flota.addEventListener("keydown", (e) => { if (e.key === "Escape") terminar(); });
  lista.addEventListener("scroll", () => { clearTimeout(lista._t); lista._t = setTimeout(guardar, 150); });
  lanzador.addEventListener("click", () => setOpen(!S.open));

  /* El lanzador flotante solo aparece cuando no hay cabecera con su propio botón «Casos». */
  const revisarLanzador = () => { lanzador.hidden = !!document.querySelector("[data-act=casos]") && !!document.querySelector(".wtop"); };
  new MutationObserver(revisarLanzador).observe(document.getElementById("app"), { childList: true, subtree: true });
  revisarLanzador();

  /* ── Arranque: se retoma lo que había antes de la recarga ── */
  pintarLista();
  const ant = leer();
  if (ant && ant.id) {
    S.caso = CASOS.find((c) => c.id === ant.id) || null;
    if (S.caso) {
      S.i = ant.i || 0; S.mode = ant.mode || "paso"; S.fresh = !!ant.fresh && S.i === 0;
      if (ant.open) { setOpen(true); lista.scrollTop = ant.y || 0; }
      paint();
      /* el modo automático sigue solo tras recargar; en manual se marca el siguiente paso */
      if (S.mode === "auto" && S.i < S.caso.steps.length) setTimeout(next, RM ? 0 : 900);
      else setTimeout(hint, 700);
    }
  } else if (ant && ant.open) { setOpen(true); }
})();
