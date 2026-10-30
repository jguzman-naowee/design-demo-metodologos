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
  const base = () => "apps/" + S.app.id + "/";
  const load = (url) => new Promise((ok) => { frame.onload = () => { if (DEV) armPicker(); ok(); }; frame.src = base() + url; });

  /* Coordenadas del elemento dentro del iframe a coordenadas de .screen (el marco puede estar escalado). */
  const rectOf = (el) => {
    const r = el.getBoundingClientRect(), f = frame.getBoundingClientRect(), k = f.width / frame.offsetWidth || 1, s = screen.getBoundingClientRect();
    return { x: f.left - s.left + r.left * k, y: f.top - s.top + r.top * k, w: r.width * k, h: r.height * k };
  };
  const find = (sel) => {
    const el = doc().querySelector(sel);
    if (!el) throw new Error("No se encontró «" + sel + "» en la pantalla.");
    return el;
  };
  const focus = async (el) => {
    el.scrollIntoView({ block: "center", behavior: RM ? "auto" : "smooth" });
    await sleep(RM ? 0 : 350);
    const r = rectOf(el), p = 6;
    Object.assign(spot.style, { left: r.x - p + "px", top: r.y - p + "px", width: r.w + 2 * p + "px", height: r.h + 2 * p + "px" });
    spot.hidden = false;
    return r;
  };
  const hideFx = () => { spot.hidden = true; cur.hidden = true; };

  async function runStep(st) {
    say.innerHTML = esc(st.body || "");
    if (st.t === "goto") { hideFx(); await load(st.url || S.app.inicio || "index.html"); return; }
    const el = find(st.sel), r = await focus(el);
    if (st.t === "click") {
      cur.hidden = false;
      cur.style.transform = "translate(" + (r.x + r.w / 2) + "px," + (r.y + r.h / 2) + "px)";
      await sleep(RM ? 0 : 650);
      cur.classList.add("press"); await sleep(RM ? 0 : 300); cur.classList.remove("press");
      const nav = new Promise((ok) => { frame.onload = () => { if (DEV) armPicker(); ok(); }; setTimeout(ok, 1200); });
      el.click(); await nav; hideFx();
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
    if (S.mode === "auto" && my === S.token && S.i < S.caso.steps.length) { await sleep(RM ? 0 : 1400); if (my === S.token) next(); }
  }

  function pick(id) {
    S.token++; S.busy = false; S.i = 0; hideFx();
    S.caso = window.CASOS.find((c) => c.id === id) || window.CASOS[0];
    frame.removeAttribute("src"); say.textContent = "Pulsa «Siguiente» para empezar.";
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
  function setSize(v) { const [w, h] = v.split("x"); document.querySelector(".phone").style.cssText = "--w:" + w + ";--h:" + h; }

  /* ── Arranque: la app sale de ?app=, y sus casos se cargan al vuelo ── */
  function openApp(id) {
    S.app = window.APPS.find((a) => a.id === id) || window.APPS[0];
    $("appSel").value = S.app.id;
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
    if (S.mode === "auto") next();
  }));
  if (DEV) {
    $("dev").hidden = false; $("devtag").hidden = false;
    $("size").addEventListener("change", (e) => setSize(e.target.value));
    $("reload").addEventListener("click", () => { if (frame.src) frame.contentWindow.location.reload(); });
    $("pickBtn").addEventListener("click", (e) => { S.pick = !S.pick; e.currentTarget.setAttribute("aria-pressed", S.pick); if (!frame.src) say.textContent = "Carga la app con «Siguiente» (primer paso goto) y luego elige un elemento."; });
    $("solo").addEventListener("click", () => { document.body.classList.add("solo"); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") document.body.classList.remove("solo"); });
  }
  if (!window.APPS.length) {
    document.querySelector(".panel").classList.add("vacio");
    $("appSel").hidden = true;
    say.innerHTML = "Aún no hay demos. Crea una con <code>npm run nueva-app -- &lt;id&gt; --desde &lt;build&gt;</code>; la guía está en <code>docs/MONTAR-DEMO-MOBILE.md</code>.";
  }
  else openApp(qs.get("app"));
})();
