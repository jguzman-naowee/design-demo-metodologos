(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const frame = $("app"), screen = $("screen"), spot = $("spot"), cur = $("cursor"), say = $("say");
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const qs = new URLSearchParams(location.search), DEV = qs.has("dev");
  const S = { app: null, caso: null, i: 0, mode: "paso", token: 0, busy: false, pick: false };

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const doc = () => frame.contentDocument;
  /* Esc también debe salir de la vista plana cuando el foco está dentro de la app (el iframe no propaga teclas). */
  const hookKeys = () => {
    const d = doc(); if (!d || d.__escHook) return; d.__escHook = true;
    d.addEventListener("keydown", (e) => { if (e.key === "Escape" && document.body.classList.contains("solo")) $("planaBtn").click(); });
  };
  const base = () => "apps/" + S.app.id + "/";
  const load = (url) => new Promise((ok) => { frame.onload = () => { hookKeys(); if (DEV) armPicker(); ok(); }; frame.src = fresh(base() + url); });
  /* Un cambio solo de #hash no recarga el iframe y conservaría el estado del caso anterior: se añade un parámetro único. */
  const fresh = (u) => { const [a, h] = u.split("#"); return a + (a.includes("?") ? "&" : "?") + "_r=" + Date.now() + (h != null ? "#" + h : ""); };

  /* Coordenadas del elemento dentro del iframe a coordenadas de .screen (el marco puede estar escalado). */
  /* El teléfono va escalado (ajuste + zoom): el recuadro y el cursor viven dentro de .screen, así que se
     expresan en píxeles locales de .screen (sin escalar). El elemento ya viene en píxeles locales del iframe. */
  const rectOf = (el) => {
    const r = el.getBoundingClientRect(), f = frame.getBoundingClientRect(), s = screen.getBoundingClientRect(), k = s.width / screen.offsetWidth || 1;
    return { x: (f.left - s.left) / k + r.left, y: (f.top - s.top) / k + r.top, w: r.width, h: r.height };
  };
  const find = (sel) => {
    const el = doc().querySelector(sel);
    if (!el) throw new Error("No se encontró «" + sel + "» en la pantalla.");
    return el;
  };
  const focus = async (el) => {
    el.scrollIntoView({ block: "center", behavior: RM ? "auto" : "smooth" });
    await sleep(RM ? 0 : 350);
    /* La app anima sus pantallas y listas: se espera a que el elemento deje de moverse para marcarlo donde queda. */
    let r = rectOf(el);
    for (let n = 0; !RM && n < 10; n++) { await sleep(60); const r2 = rectOf(el); const quieto = Math.abs(r2.x - r.x) < 1 && Math.abs(r2.y - r.y) < 1 && Math.abs(r2.w - r.w) < 1 && Math.abs(r2.h - r.h) < 1; r = r2; if (quieto) break; }
    const p = 6;
    Object.assign(spot.style, { left: r.x - p + "px", top: r.y - p + "px", width: r.w + 2 * p + "px", height: r.h + 2 * p + "px" });
    spot.hidden = false; S.fxEl = el; S.fxClick = false;
    return r;
  };
  const hideFx = () => { S.fxEl = null; spot.hidden = true; cur.hidden = true; spot.classList.remove("hint"); };

  /* Guía en modo manual: antes de pulsar «Siguiente», marca dónde va a actuar el próximo paso y dice qué hará. */
  async function hint() {
    const st = S.caso && S.caso.steps[S.i];
    if (S.mode !== "paso" || S.busy || !st || st.t === "goto" || !st.sel) return;
    const my = S.token;
    try {
      /* La pantalla puede estar aún pintándose tras el paso anterior: se espera un poco a que aparezca el elemento. */
      let el = doc().querySelector(st.sel);
      for (let n = 0; !el && n < 10; n++) { await sleep(150); if (my !== S.token || S.busy || S.mode !== "paso") return; el = doc().querySelector(st.sel); }
      if (!el) return;
      const r = await focus(el);
      if (my !== S.token || S.busy || S.mode !== "paso") return;
      spot.classList.add("hint");
      if (st.t === "click") { S.fxClick = true; cur.hidden = false; cur.style.transform = "translate(" + (r.x + r.w / 2) + "px," + (r.y + r.h / 2) + "px)"; }
      say.innerHTML = esc(st.body || "");
    } catch (e) { /* sin guía: el paso mostrará su error al ejecutarse */ }
  }

  async function runStep(st) {
    say.innerHTML = esc(st.body || "");
    if (st.t === "goto") { hideFx(); await load(st.url || S.app.inicio || "index.html"); return; }
    const el = find(st.sel), r = await focus(el);
    if (st.t === "click") {
      S.fxClick = true; cur.hidden = false;
      cur.style.transform = "translate(" + (r.x + r.w / 2) + "px," + (r.y + r.h / 2) + "px)";
      await sleep(RM ? 0 : 650);
      cur.classList.add("press"); await sleep(RM ? 0 : 300); cur.classList.remove("press");
      const nav = new Promise((ok) => { frame.onload = () => { hookKeys(); if (DEV) armPicker(); ok(); }; });
      el.click(); hideFx();
      /* Con hash routing el iframe no recarga: no esperar a un onload que no llega. Solo se espera si de verdad está cargando. */
      await Promise.race([nav, sleep(RM ? 0 : 350)]);
      if (doc().readyState !== "complete") await Promise.race([nav, sleep(1500)]);
    }
  }

  const paint = () => {
    const n = S.caso.steps.length;
    $("cnt").textContent = Math.min(S.i, n) + " / " + n;
    $("next").textContent = (S.i >= n ? "Terminado" : "Siguiente") + " ▸";
    $("next").disabled = S.i >= n || S.busy;
    document.querySelectorAll(".case").forEach((b) => b.classList.toggle("on", b.dataset.id === S.caso.id));
  };

  async function next() {
    if (!S.caso || S.busy || S.i >= S.caso.steps.length) return;
    const my = S.token; S.busy = true; paint();
    try { await runStep(S.caso.steps[S.i]); S.i++; }
    catch (e) { say.innerHTML = '<b style="color:#B3261E">' + esc(e.message) + "</b>"; hideFx(); }
    S.busy = false; paint();
    if (S.i >= S.caso.steps.length) setTimeout(hideFx, RM ? 0 : 1200);
    if (S.i >= S.caso.steps.length && S.caso.falta) say.innerHTML += '<span class="falta"><b>Pendiente:</b> ' + esc(S.caso.falta) + "</span>";
    if (S.mode === "paso" && my === S.token) hint();
    if (S.mode === "auto" && my === S.token && S.i < S.caso.steps.length) { await sleep(RM ? 0 : 1400); if (my === S.token) next(); }
  }

  function pick(id) {
    S.token++; S.busy = false; S.i = 0; hideFx();
    S.caso = window.CASOS.find((c) => c.id === id) || window.CASOS[0];
    const g = S.caso.steps[0]; /* el caso puede arrancar en otra pantalla (goto con url): se ve ya ahí, no en el login */
    load((g && g.t === "goto" && g.url) || S.app.inicio || "index.html"); say.textContent = "Pulsa «Siguiente» para empezar.";
    paint();
    if (S.mode === "auto") next();
  }

  /* ── Modo dev: elegir un elemento del teléfono y obtener su selector ── */
  function selectorOf(el) {
    const d = el.ownerDocument, uniq = (s) => { try { return d.querySelectorAll(s).length === 1; } catch (e) { return false; } };
    const attr = (n) => el.getAttribute(n) && "[" + n + '="' + el.getAttribute(n).replace(/"/g, '\\"') + '"]';
    if (el.id && uniq("#" + CSS.escape(el.id))) return "#" + CSS.escape(el.id);
    for (const n of ["data-testid", "aria-label", "name"]) { const s = attr(n); if (s && uniq(el.tagName.toLowerCase() + s)) return el.tagName.toLowerCase() + s; }
    const parts = [];
    for (let n = el; n && n.nodeType === 1 && n !== d.body && parts.length < 5; n = n.parentElement) {
      const cls = [].filter.call(n.classList, (c) => !/^(is-|has-|active|hover|focus)/.test(c)).slice(0, 2).map((c) => "." + CSS.escape(c)).join("");
      const sib = n.parentElement && [].filter.call(n.parentElement.children, (x) => x.tagName === n.tagName);
      parts.unshift(n.tagName.toLowerCase() + cls + (sib && sib.length > 1 && !cls ? ":nth-of-type(" + (sib.indexOf(n) + 1) + ")" : ""));
      if (uniq(parts.join(" > "))) break;
    }
    return parts.join(" > ");
  }
  let lastHover = null;
  function armPicker() {
    const d = doc(); if (!d || d.__dlArmed) return; d.__dlArmed = true;
    const st = d.createElement("style"); st.textContent = ".__dl-pick{outline:2px dashed #B3261E!important;outline-offset:2px}"; d.head.appendChild(st);
    d.addEventListener("mouseover", (e) => { if (!S.pick) return; if (lastHover) lastHover.classList.remove("__dl-pick"); lastHover = e.target; e.target.classList.add("__dl-pick"); }, true);
    d.addEventListener("click", (e) => {
      if (!S.pick) return;
      e.preventDefault(); e.stopPropagation();
      if (lastHover) lastHover.classList.remove("__dl-pick");
      const line = '{ t: "click", sel: ' + JSON.stringify(selectorOf(e.target)) + ', body: "" },';
      $("log").value += line + "\n";
      navigator.clipboard.writeText(line).catch(() => { /* sin permiso: queda en el cuadro */ });
    }, true);
  }
  function setSize(v) {
    const [w, h] = v.split("x");
    holder.style.setProperty("--w", w); holder.style.setProperty("--h", h);
    holder.dataset.dev = +w <= 375 ? "se" : +w >= 412 ? "pixel" : "ios";
    layout();
  }

  /* ── Marco: ajuste al espacio, zoom, panel de casos, vista plana ── */
  const holder = $("holder"), device = $("device"), body = document.body;
  const ZMIN = 0.5, ZMAX = 2, ZSTEP = 0.25;
  let zoom = 1;
  const isSolo = () => body.classList.contains("solo");
  function layout() {
    document.documentElement.style.setProperty("--hdr", $("top").offsetHeight + "px");
    if (isSolo()) return;
    const cs = getComputedStyle($("scroller")), pad = parseFloat(cs.paddingLeft) || 0;
    const W = +holder.style.getPropertyValue("--w") || 390, H = +holder.style.getPropertyValue("--h") || 844;
    const fit = Math.min((device.clientWidth - 2 * pad) / (W + 24), (device.clientHeight - 2 * pad) / (H + 24), 1);
    holder.style.setProperty("--k", Math.max(0.2, fit * zoom).toFixed(4));
    $("zOut").disabled = zoom <= ZMIN; $("zIn").disabled = zoom >= ZMAX;
    realign();
  }
  /* Tras cambiar escala o ancho: vuelve a colocar recuadro y cursor sobre el mismo elemento. */
  function realign() {
    const el = S.fxEl; if (!el || spot.hidden) return;
    try {
      const r = rectOf(el), p = 6;
      Object.assign(spot.style, { left: r.x - p + "px", top: r.y - p + "px", width: r.w + 2 * p + "px", height: r.h + 2 * p + "px" });
      if (S.fxClick && !cur.hidden) cur.style.transform = "translate(" + (r.x + r.w / 2) + "px," + (r.y + r.h / 2) + "px)";
    } catch (e) { /* el elemento ya no existe */ }
  }
  const setZoom = (z) => { zoom = Math.min(ZMAX, Math.max(ZMIN, Math.round(z * 100) / 100)); layout(); };
  $("zOut").addEventListener("click", () => setZoom(zoom - ZSTEP));
  $("zIn").addEventListener("click", () => setZoom(zoom + ZSTEP));
  $("zFit").addEventListener("click", () => setZoom(1));
  $("zPlay").addEventListener("click", () => S.caso && pick(S.caso.id));
  if (window.ResizeObserver) new ResizeObserver(layout).observe(device); else addEventListener("resize", layout);

  function setPanel(open) {
    body.classList.toggle("panel-open", open);
    $("casosBtn").setAttribute("aria-expanded", open);
    layout();
  }
  $("casosBtn").addEventListener("click", () => setPanel(!body.classList.contains("panel-open")));
  $("closePanel").addEventListener("click", () => { setPanel(false); $("casosBtn").focus(); });
  setPanel(innerWidth >= 1100);

  function setSolo(on) {
    body.classList.toggle("solo", on);
    $("planaBtn").setAttribute("aria-checked", on);
    if (on) hideFx();
    layout();
  }
  $("planaBtn").addEventListener("click", () => setSolo(!isSolo()));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && isSolo()) setSolo(false); });

  /* `estatus` (app.json): color de las franjas de estado e indicador de inicio; el texto se vuelve claro u oscuro según el fondo. */
  function setEstatus(c) {
    const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(c || "#fff"), hex = m ? (m[1].length === 3 ? m[1].replace(/./g, "$&$&") : m[1]) : "ffffff";
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
    holder.style.setProperty("--est", "#" + hex);
    holder.style.setProperty("--estfg", (0.299 * r + 0.587 * g + 0.114 * b) > 150 ? "#14162A" : "#fff");
  }

  /* ── Arranque: la app sale de ?app=, y sus casos se cargan al vuelo ── */
  function openApp(id) {
    S.app = window.APPS.find((a) => a.id === id) || window.APPS[0];
    $("appSel").value = S.app.id;
    $("appNombre").textContent = S.app.nombre || S.app.id;
    $("appSub").textContent = S.app.subtitulo || "Demo móvil";
    document.title = (S.app.nombre || S.app.id) + " · Demo móvil · Naowee";
    setEstatus(S.app.estatus);
    const s = document.createElement("script");
    s.src = base() + "casos.js?t=" + Date.now();
    s.onload = () => {
      $("cases").innerHTML = window.CASOS.map((c) => '<li><button type="button" class="case" data-id="' + esc(c.id) + '"><b>' + esc(c.id) + "</b>" + esc(c.titulo) + "</button></li>").join("");
      pick(window.CASOS[0].id);
    };
    s.onerror = () => { say.innerHTML = '<b style="color:#B3261E">Falta ' + esc(base()) + "casos.js</b>"; };
    document.head.appendChild(s);
  }

  $("appSel").innerHTML = window.APPS.map((a) => '<option value="' + esc(a.id) + '">' + esc(a.nombre || a.id) + "</option>").join("");
  $("appSel").addEventListener("change", () => { history.replaceState(null, "", "?app=" + $("appSel").value + (DEV ? "&dev=1" : "")); openApp($("appSel").value); });
  $("cases").addEventListener("click", (e) => { const b = e.target.closest(".case"); if (b) pick(b.dataset.id); });
  $("next").addEventListener("click", next);
  $("restart").addEventListener("click", () => S.caso && pick(S.caso.id));
  document.querySelectorAll(".seg button").forEach((b) => b.addEventListener("click", () => {
    S.mode = b.dataset.mode;
    document.querySelectorAll(".seg button").forEach((x) => x.classList.toggle("on", x === b));
    if (S.mode === "auto") next(); else hint();
  }));
  if (DEV) {
    $("dev").hidden = false; $("devtag").hidden = false;
    $("size").addEventListener("change", (e) => setSize(e.target.value));
    $("reload").addEventListener("click", () => { if (frame.src) frame.contentWindow.location.reload(); });
    $("pickBtn").addEventListener("click", (e) => { S.pick = !S.pick; e.currentTarget.setAttribute("aria-pressed", S.pick); if (!frame.src) say.textContent = "Carga la app con «Siguiente» (primer paso goto) y luego elige un elemento."; });
  }
  if (!window.APPS.length) {
    document.querySelector(".panel").classList.add("vacio");
    $("appSel").hidden = true;
    say.innerHTML = "Aún no hay demos. Crea una con <code>npm run nueva-app -- &lt;id&gt; --desde &lt;build&gt;</code>; la guía está en <code>docs/MONTAR-DEMO-MOBILE.md</code>.";
  }
  else openApp(qs.get("app"));
})();
