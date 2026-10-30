/* ═════════════════════════════════════════════════════════════════════════════════════════
   ui.js — helpers compartidos de la app de Metodólogos (window.Ui). No lo edites para añadir pantallas.

   CONTRATO PARA AÑADIR UNA PANTALLA (sin tocar archivos de la base)
   1. Crea js/screens/<nombre>.js y añade su <script> en index.html, debajo de los demás de js/screens/
      (es la única línea que se toca fuera de tu archivo; main.js arranca después de todos).
   2. En tu archivo registra la ruta:  Router.add("/evento/:id", { render(params, ctx) { return Ui.page({...}) },
      mount(root, params, ctx) { ...listeners...; return () => limpiar() } })   (ver router.js).
      También vale una función sola:  Router.add("/perfil", (params) => "<html>").
   3. Todo valor visual sale de css/tokens.css (variables) y todo componente de css/components.css. Si falta un
      componente, añade CSS en TU archivo css/screens/<nombre>.css (enlázalo en index.html) o un <style> propio;
      si falta un token, créalo en tokens.css (mismo criterio que la app: nada suelto).
   4. Navega con enlaces <a href="#/ruta"> o Router.go("/ruta"); vuelve con Router.back("/ruta-por-defecto").
   5. Selectores estables para los casos: data-testid="<pantalla>-<elemento>" en lo interactivo (ej. "evento-card-e1",
      "nav-perfil", "login-ingresar"); data-act="<acción>" para acciones sin navegación. Usa aria-label en botones de icono.
   6. Datos: window.Data (data.js). Sesión: window.Session (session.js, solo memoria). No hay red ni localStorage.

   API (todas devuelven strings HTML salvo que se indique)
   Ui.esc(s)                              escapa texto para HTML
   Ui.icon(nombre, {size=24, color, label}) icono SVG inline desde window.ICONS. Se tiñe como en la app (ColorFilter srcIn)
                                          con `color` (cualquier color CSS / var(--token)); sin color hereda currentColor.
                                          Los iconos de Material llevan prefijo "m-" (m-close, m-menu, m-keyboard_arrow_down...).
   Ui.rawIcon(nombre, {size})             icono con sus colores originales
   Ui.registerIcon(nombre, svg)           añade un icono nuevo al registro
   Ui.chip(estado[, label])               OcStatusChip (estado: calificado|sinCalificacion|enCurso|programado|finalizado|info)
   Ui.button({title, variant, size, testid, act, href, type, fit, disabled, leftIcon, leftIconColor, rightIcon})
                                          OcButton; variant: primary|dark|cream|cream-outlined|outline; size: large|medium|small
   Ui.appBar()                            OcAppBar (logo → #/eventos, menú → panel «Conoce más»; el panel se engancha solo)
   Ui.bottomNav(actual)                   OcBottomNav; actual: "eventos" | "perfil" | null
   Ui.page({appBar=true, nav=null, body, scroll=false, bodyClass})  página completa (columna: appbar / cuerpo / nav)
   Ui.empty(mensaje, {icon})              OcEmptyState
   Ui.openSheet({title, body, onMount(el, close), onClose}) → {el, close}   bottom sheet modal (como showModalBottomSheet)
   Ui.openSidePanel(html, {onMount}) → {el, close}                          panel lateral derecho (Conoce más)
   Ui.toast(mensaje, tipo="info", ms=5000)  OcSnackbar: error|warning|success|info
   Ui.on(root, evento, selector, fn)      delegación de eventos; fn(ev, elemento)
   Ui.html(str) → Node                    convierte HTML en elemento
   Ui.search(texto, {placeholder, testid, label})   OcSearchBar sin el trailing
   Ui.checkRow({label, checked, testid})  fila con casilla (filtros)
   ═════════════════════════════════════════════════════════════════════════════════════════ */
(() => {
  "use strict";

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ICONS = window.ICONS || {};
  const html = (str) => { const t = document.createElement("template"); t.innerHTML = str.trim(); return t.content.firstElementChild; };
  const attr = (n, v) => (v ? " " + n + '="' + esc(v) + '"' : "");

  /* ── Iconos ──
     OcImage = SvgPicture con fit scaleDown: el icono mantiene su tamaño natural y solo se reduce si no cabe en `size`.
     Por eso el icono va dentro de una caja size×size (.icbox) y el SVG conserva su width/height de origen. */
  function svgOf(nombre, size, tint) {
    const src = ICONS[nombre];
    if (!src) { console.warn("[ui] icono desconocido:", nombre); return ""; }
    let s = src;
    const w = /<svg[^>]*\swidth="([\d.]+)"/.exec(s), h = /<svg[^>]*\sheight="([\d.]+)"/.exec(s);
    const nat = w && h ? [parseFloat(w[1]), parseFloat(h[1])] : [size, size];
    s = s.replace(/<svg([^>]*)>/, (m, a) => "<svg" + a.replace(/\s(width|height)="[^"]*"/g, "") + ' class="ic" width="' + nat[0] + '" height="' + nat[1] + '" aria-hidden="true" focusable="false">');
    if (tint) {
      s = s.replace(/(fill|stroke)="(?!none)[^"]*"/g, '$1="currentColor"');
      /* srcIn tiñe también lo que no declara fill (relleno negro por defecto): se hereda del <svg> raíz */
      s = s.replace(/<svg([^>]*)>/, (m, a) => (/\sfill=/.test(a) ? m : "<svg" + a + ' fill="currentColor">'));
    }
    return s;
  }
  const icon = (nombre, o) => {
    o = o || {}; const size = o.size || 24;
    return '<span class="icbox" style="display:flex;align-items:center;justify-content:center;flex:none;width:' + size + "px;height:" + size + "px;overflow:hidden" + (o.color ? ";color:" + o.color : "") + '"' + (o.label ? ' role="img" aria-label="' + esc(o.label) + '"' : ' aria-hidden="true"') + ">" + svgOf(nombre, size, true) + "</span>";
  };
  const rawIcon = (nombre, o) => { const size = (o && o.size) || 24; return '<span class="icbox" style="display:flex;align-items:center;justify-content:center;flex:none;width:' + size + "px;height:" + size + 'px" aria-hidden="true">' + svgOf(nombre, size, false) + "</span>"; };
  const registerIcon = (nombre, svg) => { ICONS[nombre] = svg; };

  /* Estilo mínimo del icbox: el svg nunca excede la caja (scaleDown) */
  const st = document.createElement("style");
  st.textContent = ".icbox>svg.ic{max-width:100%;max-height:100%}";
  document.head.appendChild(st);

  /* ── Componentes ── */
  const chip = (estado, label) => '<span class="chip ' + esc(estado) + '">' + esc(label != null ? label : (window.Data && Data.STATUS_LABEL[estado]) || "") + "</span>";

  const button = (o) => {
    const cls = ["btn", o.variant || "primary", o.size && o.size !== "large" ? o.size : "", o.fit ? "fit" : ""].filter(Boolean).join(" ");
    const inner = (o.leftIcon ? icon(o.leftIcon, { size: 20, color: o.leftIconColor || "currentColor" }) : "") + "<span>" + esc(o.title) + "</span>" + (o.rightIcon ? icon(o.rightIcon, { size: 20, color: "currentColor" }) : "");
    const common = ' class="' + cls + '"' + attr("data-testid", o.testid) + attr("data-act", o.act);
    if (o.href) return "<a" + common + ' href="' + esc(o.href) + '">' + inner + "</a>";
    return "<button type=\"" + (o.type || "button") + '"' + common + (o.disabled ? " disabled" : "") + ">" + inner + "</button>";
  };

  const appBar = () =>
    '<header class="appbar">' +
      '<a class="appbar-btn logo" href="#/eventos" data-testid="appbar-logo" aria-label="Ir a Eventos"><img src="assets/images/coc_logo.png" alt="" width="40" height="40"></a>' +
      '<button type="button" class="appbar-btn menu" data-testid="appbar-menu" data-act="conoce-mas" aria-label="Abrir menú Conoce más" aria-haspopup="dialog">' + icon("m-menu", { size: 24, color: "var(--blue-jic-900)" }) + "</button>" +
    "</header>";

  const NAV = [
    { id: "eventos", href: "#/eventos", label: "Eventos", icon: "calendario" },
    { id: "perfil", href: "#/perfil", label: "Mi perfil", icon: "usuario" },
  ];
  const bottomNav = (actual) =>
    '<nav class="bnav" aria-label="Navegación principal">' +
    NAV.map((n) => '<a class="bnav-item" href="' + n.href + '" data-testid="nav-' + n.id + '"' + (n.id === actual ? ' aria-current="page"' : "") + ">" +
      icon(n.icon, { size: 20, color: "currentColor" }) + '<span class="t-tag">' + esc(n.label) + '</span><span class="bar"></span></a>').join("") +
    "</nav>";

  const page = (o) => {
    o = o || {};
    return '<div class="page page-safe"' + attr("data-testid", o.testid) + ">" +
      (o.appBar === false ? "" : appBar()) +
      '<main class="page-body' + (o.scroll ? " scroll" : "") + (o.bodyClass ? " " + o.bodyClass : "") + '">' + (o.body || "") + "</main>" +
      (o.nav ? bottomNav(o.nav) : (o.nav === null ? "" : "")) +
    "</div>";
  };

  const empty = (msg, o) => '<div class="empty" data-testid="empty-state">' + ((o && o.icon === null) ? "" : icon((o && o.icon) || "m-search_off", { size: 40 })) + "<p>" + esc(msg) + "</p></div>";

  const search = (value, o) => {
    o = o || {};
    return '<label class="search">' + icon("lupa", { size: 24, color: "var(--gray-700)" }) +
      '<input type="search" value="' + esc(value || "") + '" placeholder="' + esc(o.placeholder || "Buscar") + '" aria-label="' + esc(o.label || o.placeholder || "Buscar") + '"' + attr("data-testid", o.testid) + ' autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search"></label>';
  };

  const checkRow = (o) => '<button type="button" class="checkrow" role="checkbox" aria-checked="' + (o.checked ? "true" : "false") + '"' + attr("data-label", o.label) + attr("data-testid", o.testid) + ">" +
    '<span class="checkbox">' + icon("m-check", { size: 16, color: "var(--white-alpha-100)" }) + "</span><span>" + esc(o.label) + "</span></button>";

  /* ── Superposiciones (sheets, panel lateral, toast) viven dentro de #app para quedar dentro del teléfono ── */
  const host = () => document.getElementById("app");
  let openLayer = null;
  function closeLayer() { if (openLayer) openLayer.close(); }

  function layer(el, scrimClass, o) {
    closeLayer();
    const root = host(), prevFocus = document.activeElement;
    const scrim = html('<div class="scrim ' + (scrimClass || "") + '" data-testid="sheet-scrim"></div>');
    root.appendChild(scrim); root.appendChild(el);
    el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true");
    requestAnimationFrame(() => requestAnimationFrame(() => { scrim.classList.add("show"); el.classList.add("show"); }));
    let done = false;
    const onKey = (e) => { if (e.key === "Escape") api.close(); };
    const api = {
      el,
      close() {
        if (done) return; done = true; openLayer = null;
        document.removeEventListener("keydown", onKey);
        scrim.classList.remove("show"); el.classList.remove("show");
        const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
        setTimeout(() => { scrim.remove(); el.remove(); }, reduce ? 0 : 260);
        if (prevFocus && prevFocus.focus && document.contains(prevFocus)) prevFocus.focus();
        if (o && o.onClose) o.onClose();
      },
    };
    openLayer = api;
    scrim.addEventListener("click", api.close);
    document.addEventListener("keydown", onKey);
    return api;
  }

  /* showModalBottomSheet: asa 40×4, título h2 + X, divisor, contenido */
  function openSheet(o) {
    const el = html('<section class="sheet" aria-label="' + esc(o.title) + '"><div class="sheet-handle"></div>' +
      '<div class="sheet-head"><h2 class="t-h2">' + esc(o.title) + '</h2><button type="button" class="sheet-x" data-testid="sheet-cerrar" aria-label="Cerrar">' + icon("m-close", { size: 24, color: "var(--blue-jic-900)" }) + "</button></div>" +
      '<div class="sheet-div"></div><div class="sheet-pad">' + (o.body || "") + "</div></section>");
    const api = layer(el, "", o);
    el.querySelector(".sheet-x").addEventListener("click", api.close);
    if (o.onMount) o.onMount(el, api.close);
    el.setAttribute("tabindex", "-1"); el.focus({ preventScroll: true });
    return api;
  }
  function openSidePanel(inner, o) {
    const el = html('<aside class="sidepanel" aria-label="Conoce más">' + inner + "</aside>");
    const api = layer(el, "side", o);
    const x = el.querySelector("[data-act=cerrar-panel]"); if (x) x.addEventListener("click", api.close);
    if (o && o.onMount) o.onMount(el, api.close);
    el.setAttribute("tabindex", "-1"); el.focus({ preventScroll: true });
    return api;
  }

  let toastTimer = null;
  function toast(msg, tipo, ms) {
    const root = host(); root.querySelectorAll(".snack").forEach((n) => n.remove()); clearTimeout(toastTimer);
    const el = html('<div class="snack ' + (tipo || "info") + '" role="status" data-testid="snackbar"><span>' + esc(msg) + '</span><button type="button" aria-label="Cerrar aviso">' + icon("m-close", { size: 16, color: "currentColor" }) + "</button></div>");
    const nav = root.querySelector(".bnav"); if (nav) el.style.bottom = nav.offsetHeight + 10 + "px";
    el.querySelector("button").addEventListener("click", () => el.remove());
    root.appendChild(el); toastTimer = setTimeout(() => el.remove(), ms || 5000);
  }

  /* Los delegados puestos sobre #app (que persiste entre pantallas) se quitan al cambiar de ruta (Ui.offAll, lo llama el router); si no, se acumulan y se disparan en pantallas ajenas. */
  const delegados = [];
  function on(root, ev, sel, fn) { const h = (e) => { const t = e.target.closest(sel); if (t && root.contains(t)) fn(e, t); }; root.addEventListener(ev, h); delegados.push([root, ev, h]); }
  function offAll() { delegados.splice(0).forEach(([r, ev, h]) => r.removeEventListener(ev, h)); }

  /* «Conoce más» (oc_conoce_mas_sheet.dart). Delegado a nivel documento: el menú existe en todas las pantallas con appbar. */
  function conoceMas() {
    openSidePanel(
      '<button type="button" class="x" data-act="cerrar-panel" data-testid="conoce-mas-cerrar" aria-label="Cerrar">' + icon("m-close", { size: 24, color: "var(--orange-700)" }) + "</button>" +
      '<h2 class="t-h2">Conoce más</h2>' +
      "<p>Entérate del desarrollo de los eventos y las iniciativas del ciclo olímpico en nuestra landing page.</p>" +
      '<button type="button" class="linkrow" data-testid="conoce-mas-visitanos" data-act="visitanos"><span class="t-body c-negro">Visítanos</span>' + icon("arrow-up-right", { size: 20, color: "var(--orange-700)" }) + "</button>"
    , { onMount(el) { el.querySelector("[data-act=visitanos]").addEventListener("click", () => toast("En la app real se abre la landing del ciclo olímpico dentro de la app; aquí no hay sitio externo.", "info")); } });
  }
  document.addEventListener("click", (e) => { const m = e.target.closest("[data-act=conoce-mas]"); if (m) conoceMas(); });

  window.Ui = { esc, html, icon, rawIcon, registerIcon, chip, button, appBar, bottomNav, page, empty, search, checkRow, openSheet, openSidePanel, toast, on, closeLayer, conoceMas, offAll };
})();
