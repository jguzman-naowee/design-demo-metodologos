/* ═════════════════════════════════════════════════════════════════════════════════════════
   router.js — router por hash (window.Router). Sin dependencias, sin history API: #/eventos, #/evento/e1 ...

   Registrar una ruta (desde js/screens/<pantalla>.js):
     Router.add("/evento/:id", {
       render(params, ctx) { return Ui.page({ nav: "eventos", body: "..." }); },   // string HTML o Node
       mount(root, params, ctx) { ...enlazar eventos sobre `root`...; return () => { limpieza al salir }; },
     });
     Router.add("/perfil", (params, ctx) => "<div>...</div>");                      // forma corta (solo render)
   - params: segmentos ":nombre" ya decodificados. ctx: { path, query } (query de "#/ruta?x=1").
   - `root` es el contenedor #app; la pantalla anterior se descarta entera en cada navegación.

   Navegar:  <a href="#/ruta">  ·  Router.go("/ruta")  ·  Router.replace("/ruta")  ·  Router.back("/ruta-si-no-hay-historial")
   Guard:    Router.guard((path) => null | "/otra-ruta")   (lo define main.js; lo usa la sesión simulada)
   Ruta sin pantalla montada: se muestra un marcador «pendiente» (no un error), para poder enlazar antes de implementar.
   ═════════════════════════════════════════════════════════════════════════════════════════ */
(() => {
  "use strict";
  const routes = [];
  let guardFn = null, cleanup = null, stack = [], current = { path: "", params: {}, query: {} };
  const root = () => document.getElementById("app");

  const compile = (pattern) => {
    const keys = [];
    const re = new RegExp("^" + pattern.replace(/\/:([A-Za-z0-9_]+)/g, (m, k) => { keys.push(k); return "/([^/]+)"; }) + "/?$");
    return { pattern, re, keys };
  };
  const add = (pattern, handler) => {
    const h = typeof handler === "function" ? { render: handler } : handler;
    routes.push(Object.assign(compile(pattern), { h }));
  };
  const parse = () => {
    const raw = location.hash.replace(/^#/, "") || "";
    const [path, qs] = raw.split("?");
    const query = {}; new URLSearchParams(qs || "").forEach((v, k) => { query[k] = v; });
    return { path: path || "/", query };
  };
  const match = (path) => {
    for (const r of routes) { const m = r.re.exec(path); if (m) { const params = {}; r.keys.forEach((k, i) => { params[k] = decodeURIComponent(m[i + 1]); }); return { r, params }; } }
    return null;
  };

  const pendiente = (path) =>
    '<div class="page page-safe" data-testid="pantalla-pendiente"><div class="page-body" style="align-items:center;justify-content:center;padding:var(--sp-m-M);text-align:center">' +
    '<p class="t-subtitle">Pantalla pendiente</p><p class="t-body-small c-gray-700" style="margin:8px 0 20px">La ruta <b>#' + Ui.esc(path) + "</b> aún no está montada en la demo.</p>" +
    '<a class="btn dark fit" href="#/eventos" data-testid="pendiente-volver">Volver a Eventos</a></div></div>';

  const TABS = ["/eventos", "/perfil"];
  function render() {
    const { path, query } = parse();
    const redirect = guardFn && guardFn(path);
    if (redirect && redirect !== path) { location.replace("#" + redirect); return; }
    /* Dirección de la transición: volver (la ruta anterior de la pila), cambiar de pestaña, primera pantalla o avanzar */
    const volver = stack.length > 1 && stack[stack.length - 2] === path, prev = current.path;
    const dir = !prev ? "fade" : (TABS.includes(prev) && TABS.includes(path)) ? "tab" : volver ? "back" : "push";
    /* Pila propia para Router.back(): volver a la ruta anterior desapila; cualquier otra se apila */
    if (stack.length > 1 && stack[stack.length - 2] === path) stack.pop(); else if (stack[stack.length - 1] !== path) stack.push(path);
    if (typeof cleanup === "function") { try { cleanup(); } catch (e) { console.error(e); } }
    cleanup = null; Ui.offAll(); Ui.closeLayer();
    const hit = match(path), el = root();
    const ctx = { path, query };
    current = { path, params: hit ? hit.params : {}, query };
    let out = hit ? hit.r.h.render(current.params, ctx) : pendiente(path);
    el.innerHTML = ""; el.dataset.nav = dir;
    if (typeof out === "string") el.insertAdjacentHTML("beforeend", out); else if (out) el.appendChild(out);
    if (hit && hit.r.h.mount) cleanup = hit.r.h.mount(el, current.params, ctx) || null;
  }

  window.addEventListener("hashchange", render);
  window.Router = {
    add,
    guard(fn) { guardFn = fn; },
    go(path) { location.hash = "#" + path; },
    replace(path) { location.replace("#" + path); },
    back(fallback) { if (stack.length > 1) history.back(); else if (fallback) Router.replace(fallback); },
    start(initial) { if (!location.hash || location.hash === "#") location.replace("#" + (initial || "/")); else render(); }, /* sin hash: el replace dispara hashchange */
    get current() { return current; },
  };
})();
