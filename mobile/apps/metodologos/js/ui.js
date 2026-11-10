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
   Ui.toast(mensaje, tipo="info", ms=5000, titulo)  NwtToast del SDK: error|warning|success|info
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
  /* Glifos de las alertas del SDK (NwtAlert / NwtToast): van dentro de un círculo relleno (i, !) o sueltos en las alertas mute (circulo + i / !) */
  registerIcon("nwt-i", '<svg viewBox="0 0 24 24"><circle cx="12" cy="6.8" r="1.7" fill="currentColor"/><rect x="10.6" y="10.3" width="2.8" height="8.4" rx="1.2" fill="currentColor"/></svg>');
  registerIcon("nwt-exclamacion", '<svg viewBox="0 0 24 24"><rect x="10.6" y="4.8" width="2.8" height="9" rx="1.2" fill="currentColor"/><circle cx="12" cy="18.3" r="1.7" fill="currentColor"/></svg>');
  registerIcon("nwt-info-o", '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="8" r="1.2" fill="currentColor"/><rect x="11" y="10.8" width="2" height="6" rx="1" fill="currentColor"/></svg>');
  registerIcon("nwt-alerta-o", '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><rect x="11" y="6.8" width="2" height="6.4" rx="1" fill="currentColor"/><circle cx="12" cy="16.4" r="1.2" fill="currentColor"/></svg>');

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

  /* Doble chulo («marcar todas como leídas») */
  registerIcon("nwt-doble-check", '<svg viewBox="0 0 24 24"><path d="M1.5 12.8l4.3 4.3L13.8 7.6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.6 15.6l1.5 1.5L21 5.6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>');
  /* Campana de notificaciones: lleva a la bandeja; la insignia cuenta los avisos sin leer (window.Alertas, js/data-alertas.js) */
  registerIcon("nwt-campana", '<svg viewBox="0 0 24 24"><path d="M12 3.5a5.5 5.5 0 0 0-5.5 5.5v3.2c0 .8-.3 1.5-.8 2.1L4.6 15.6A1 1 0 0 0 5.4 17.2h13.2a1 1 0 0 0 .8-1.6l-1.1-1.3c-.5-.6-.8-1.3-.8-2.1V9A5.5 5.5 0 0 0 12 3.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9.8 19.5a2.4 2.4 0 0 0 4.4 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>');
  const sinLeer = () => (window.Alertas ? Alertas.sinLeer() : 0);
  const campana = () => { const n = sinLeer(); return '<button type="button" class="appbar-btn bell" data-testid="appbar-notificaciones" data-act="notificaciones" aria-label="Notificaciones' + (n ? ", " + n + (n === 1 ? " sin leer" : " sin leer") : "") + '">' +
    icon("nwt-campana", { size: 26, color: "var(--blue-jic-900)" }) + '<span class="bell-badge" data-testid="campana-insignia"' + (n ? "" : " hidden") + ">" + (n || "") + "</span></button>"; };
  /* Actualiza la insignia de todas las campanas visibles (tras leer avisos) */
  const actualizarCampana = () => { const n = sinLeer(); document.querySelectorAll(".bell").forEach((b) => { const i = b.querySelector(".bell-badge"); i.textContent = n || ""; i.hidden = !n; b.setAttribute("aria-label", "Notificaciones" + (n ? ", " + n + " sin leer" : "")); }); };
  const appBar = () =>
    '<header class="appbar">' +
      '<a class="appbar-btn logo" href="#/eventos" data-testid="appbar-logo" aria-label="Ir a Eventos"><img src="assets/images/coc_logo.png" alt="" width="40" height="40"></a>' +
      '<div class="appbar-r">' + campana() +
      '<button type="button" class="appbar-btn menu" data-testid="appbar-menu" data-act="conoce-mas" aria-label="Abrir menú Conoce más" aria-haspopup="dialog">' + icon("m-menu", { size: 24, color: "var(--blue-jic-900)" }) + "</button></div>" +
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

  /* NwtToast (SDK de Naowee): aviso inferior con tema, icono, título y mensaje; entra deslizando (240 ms) y se cierra solo.
     toast(mensaje, tipo, ms, titulo): tipo success|warning|error|info → tema positive|warning|negative|informative. */
  const TOAST_TEMAS = { success: ["positive", "m-check", "Listo"], warning: ["warning", "nwt-exclamacion", "Revisa"], error: ["negative", "nwt-exclamacion", "Algo salió mal"], info: ["informative", "nwt-i", "Aviso"] };
  let toastTimer = null, toastEl = null;
  function cerrarToast(el) {
    if (!el || !el.isConnected) return;
    el.classList.remove("nwt-toast--visible");
    setTimeout(() => el.remove(), 260);
  }
  function toast(msg, tipo, ms, titulo) {
    const root = host(); clearTimeout(toastTimer);
    if (toastEl) { toastEl.remove(); toastEl = null; }
    const t = TOAST_TEMAS[tipo] || TOAST_TEMAS.info;
    const el = html('<div class="nwt-toast" role="status" data-testid="snackbar"><div class="nwt-toast__content" nwt-theme="' + t[0] + '"><div class="nwt-toast__component">' +
      '<div class="nwt-avatar-icon">' + icon(t[1], { size: 16, color: "var(--naotech-icon-color)" }) + "</div>" +
      '<div class="nwt-toast__body"><div class="nwt-toast__title">' + esc(titulo || t[2]) + '</div><div class="nwt-toast__message"><p class="nwt-toast__message__value">' + esc(msg) + "</p></div>" +
      '<button type="button" class="nwt-toast__close" aria-label="Cerrar aviso">' + icon("m-close", { size: 20, color: "currentColor" }) + "</button></div></div></div></div>");
    const nav = root.querySelector(".bnav"); if (nav) el.style.bottom = nav.offsetHeight + "px";
    el.querySelector(".nwt-toast__close").addEventListener("click", () => { clearTimeout(toastTimer); cerrarToast(el); });
    root.appendChild(el); toastEl = el;
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("nwt-toast--visible")));
    toastTimer = setTimeout(() => cerrarToast(el), ms || 5000);
  }

  /* Logo animado del COC (el del inicio de sesión): la ola se dibuja, COLOMBIA sube letra a letra y los aros hacen «pop» de a uno.
     tamano: lado de la caja en px (110 por defecto); dur: duración del ciclo en ms (3000 por defecto). Las imágenes son las capas assets/images/coc_logo_*.png. */
  const LETRAS = [[3.628, 12.576], [16.989, 13.301], [32.044, 6.227], [38.875, 13.301], [53.748, 13.362], [69.287, 8.283], [79.262, 2.418], [82.95, 12.455]];
  const logoAnimado = (o) => {
    o = o || {}; const t = o.tamano || 110, d = o.dur || 3000;
    return '<div class="login-logo" role="img" aria-label="Comité Olímpico Colombiano" style="width:' + t + "px;height:" + t + "px;--lg-dur:" + d + 'ms"><div class="login-logo-in"><img class="lg-wave" src="assets/images/coc_logo_wave.png" alt="">' +
      '<div class="lg-word">' + LETRAS.map((l, k) => '<img class="lg-l' + k + '" style="left:' + l[0] + "%;width:" + l[1] + '%" src="assets/images/coc_logo_l' + k + '.png" alt="">').join("") + "</div>" +
      '<div class="lg-rings">' + [0, 1, 2, 3, 4].map((k) => '<img class="lg-r' + k + '" src="assets/images/coc_logo_r' + k + '.png" alt="">').join("") + "</div></div></div>";
  };

  /* NwtAlert mute (SDK de Naowee): mensaje de una línea sin fondo, con icono y el color del tema. tema: informative|negative|… ; textoHtml ya viene escapado. */
  const alertaMute = (tema, textoHtml, testid) => '<div class="nwt-alert nwt-alert--visible" nwt-theme="' + tema + '" nwt-variant="mute"' + (testid ? ' data-testid="' + esc(testid) + '"' : "") + '><div class="nwt-alert__content"><div class="nwt-alert__icon">' +
    icon(tema === "negative" ? "nwt-alerta-o" : "nwt-info-o", { size: 16, color: "currentColor" }) + '</div><span class="nwt-alert__label">' + textoHtml + "</span></div></div>";

  /* Subrayado que se desliza bajo la pestaña activa. Devuelve mover(animar): llamarlo tras cambiar la pestaña .on. */
  function tabIndicator(tabsEl) {
    const ind = document.createElement("span"); ind.className = "tab-ind"; ind.setAttribute("aria-hidden", "true"); tabsEl.appendChild(ind);
    const mover = (animar) => {
      const t = tabsEl.querySelector(".tab.on"); if (!t) return;
      const caja = tabsEl.getBoundingClientRect(), r = t.querySelector(".tab-in").getBoundingClientRect();
      ind.classList.toggle("sin-anim", !animar); ind.style.width = r.width + "px"; ind.style.transform = "translateX(" + (r.left - caja.left) + "px)";
    };
    requestAnimationFrame(() => mover(false));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => mover(false));
    window.addEventListener("resize", () => mover(false));
    return mover;
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
    , { onMount(el) { el.querySelector("[data-act=visitanos]").addEventListener("click", () => toast("En la app real se abre la landing del ciclo olímpico dentro de la app; aquí no hay sitio externo.", "info", 0, "Solo en la app real")); } });
  }
  document.addEventListener("click", (e) => { const m = e.target.closest("[data-act=conoce-mas]"); if (m) conoceMas(); });
  document.addEventListener("click", (e) => { if (e.target.closest("[data-act=notificaciones]") && location.hash.split("?")[0] !== "#/notificaciones") location.hash = "#/notificaciones"; });

  window.Ui = { logoAnimado, actualizarCampana, tabIndicator, alertaMute, esc, html, icon, rawIcon, registerIcon, chip, button, appBar, bottomNav, page, empty, search, checkRow, openSheet, openSidePanel, toast, on, closeLayer, conoceMas, offAll };
})();
