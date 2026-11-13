/* Capa web (web.html): la MISMA app del metodólogo en escritorio. No duplica pantallas ni datos: web.css las reacomoda
   y este archivo arma, con componentes del SDK de Naowee (sdk-react-components → clases de sdk-frontend-foundations):
     · NwtSidebar (organisms/Sidebar, modo fixed, colapsable), con rótulos de sección; NwtAvatar (usuario) y NwtBadge (avisos sin leer) en el encabezado
     · NwtModal   (organisms/Modal) en lugar de las hojas inferiores (Ui.openSheet), solo en escritorio
   Los íconos son los SVG de la demo (el SDK usa una fuente de íconos). Por debajo de 900 px todo vuelve a verse como la app móvil. */
(() => {
  "use strict";
  const SIN_MENU = ["/login", "/celular", "/actualizar"]; /* pantallas a sangre: sin menú lateral */
  const ESCRITORIO = "(min-width: 900px)";
  const NAV = [
    { id: "eventos", route: "#/eventos", label: "Eventos", icon: "calendario", section: "Evaluación" },
  ];
  const esc = Ui.esc, root = document.documentElement;
  let colapsado = false;

  const host = document.createElement("div");
  host.className = "wside"; host.setAttribute("data-testid", "web-menu");
  document.body.appendChild(host);
  /* Encabezado (campana + usuario) y pie flotante de Naowee, como en los portales Naowee */
  const top = document.createElement("header"); top.className = "wtop"; top.setAttribute("data-testid", "web-encabezado"); document.body.appendChild(top);
  const pie = document.createElement("div"); pie.className = "wpie"; document.body.appendChild(pie);

  const rutaActual = () => (location.hash.replace(/^#/, "").split("?")[0] || "/");
  /* Sección del menú que corresponde a la ruta: el detalle de un evento, el deportista y la evaluación cuelgan de «Eventos» */
  const seccion = (p) => (p === "/perfil" ? "perfil" : p === "/notificaciones" ? null : "eventos");

  /* NwtBadge: tema «negative» (rojo), tamaño pequeño; se oculta sin avisos */
  const insignia = (n) => '<span class="nwt-badge wside-badge" role="status" nwt-theme="caution" nwt-size="small" nwt-variant="loud" data-testid="web-campana-insignia"' + (n ? "" : " hidden") + '><div class="nwt-badge__content"><div class="nwt-badge__label">' + (n || "") + "</div></div></span>";

  const item = (m, activo, n) => {
    const visual = '<div class="nwt-sidebar__menu__content"><span class="nwt-sidebar__menu__icon">' + Ui.icon(m.icon, { size: 22, color: "currentColor" }) + '</span><span class="nwt-sidebar__menu__label">' + esc(m.label) + "</span>" + (m.badge ? insignia(n) : "") + "</div>";
    const cls = "nwt-sidebar__menu__link", tip = '<span aria-hidden="true" class="nwt-sidebar__tooltip">' + esc(m.label) + "</span>";
    const enlace = m.route
      ? '<a class="' + cls + '" href="' + m.route + '" data-testid="web-nav-' + m.id + '" aria-label="' + esc(m.label) + '">' + visual + "</a>"
      : '<button type="button" class="' + cls + '" data-act="' + m.accion + '" data-testid="web-nav-' + m.id + '" aria-label="' + esc(m.label) + '">' + visual + "</button>";
    const sec = m.section ? '<li class="nwt-sidebar__menu__section"><span>' + esc(m.section) + "</span></li>" : "";
    return sec + '<li class="nwt-sidebar__menu__item' + (activo ? " nwt-sidebar__menu__item--active" : "") + '">' + (activo ? '<span aria-hidden="true" class="nwt-sidebar__menu__indicator"></span>' : "") + enlace + (colapsado ? tip : "") + "</li>";
  };

  /* «Conoce más» lleva a la web del Comité Olímpico Colombiano (en la app real, la landing del ciclo olímpico) */
  const LANDING = "https://coc.org.co";
  const pintar = () => {
    const p = rutaActual(), visible = Session.isLoggedIn && !SIN_MENU.includes(p);
    root.classList.toggle("con-menu", visible);
    root.classList.toggle("menu-colapsado", visible && colapsado);
    if (!visible) { host.innerHTML = ""; top.innerHTML = ""; pie.innerHTML = ""; return; }
    const n = Alertas.sinLeer(), act = seccion(p), u = Data.usuario || {}, nombre = u.name || "Metodólogo";
    const iniciales = nombre.split(/\s+/).filter(Boolean).slice(0, 2).map((x) => x[0].toUpperCase()).join("");
    host.innerHTML =
      '<aside class="nwt-sidebar nwt-sidebar--mode-fixed nwt-sidebar--open' + (colapsado ? " nwt-sidebar--collapsed" : "") + '" aria-label="Navegación principal">' +
        '<div class="nwt-sidebar__toolbar">' +
          '<button type="button" class="nwt-sidebar__toolbar__button" data-act="web-colapsar" data-testid="web-colapsar" aria-label="' + (colapsado ? "Expandir menú" : "Colapsar menú") + '" aria-pressed="' + colapsado + '">' +
            Ui.icon("m-menu", { size: 26, color: "currentColor" }) + "</button>" +
          '<div class="nwt-sidebar__toolbar__logo"><a class="wside-marca" href="#/eventos" data-testid="web-logo" aria-label="Ir a Eventos"><img src="assets/images/coc_logo.png" alt="" width="44" height="44"><span class="wside-sep" aria-hidden="true"></span><span class="wside-nombre">Metodólogos</span></a></div>' +
        "</div>" +
        '<div class="nwt-sidebar__content">' +
          '<nav class="nwt-sidebar__menu" aria-label="Menú principal"><ul class="nwt-sidebar__menu__list">' + NAV.map((m) => item(m, m.id === act, n)).join("") + "</ul></nav>" +
          '<div class="wside-conoce"><a class="nwt-sidebar__footer__logout" href="' + LANDING + '" target="_blank" rel="noopener" data-testid="web-conoce-mas"' + (colapsado ? ' aria-label="Conoce más"' : "") + ">" +
            '<span class="nwt-sidebar__menu__icon">' + Ui.icon("nwt-info-o", { size: 22, color: "currentColor" }) + '</span><span class="nwt-sidebar__footer__logout__label">Conoce más</span>' +
            (colapsado ? '<span aria-hidden="true" class="nwt-sidebar__tooltip">Conoce más</span>' : '<span class="wside-ext">' + Ui.icon("arrow-up-right", { size: 18, color: "currentColor" }) + "</span>") + "</a></div>" +
          '<div class="nwt-sidebar__footer"><button type="button" class="nwt-sidebar__footer__logout" data-act="web-salir" data-testid="web-cerrar-sesion"' + (colapsado ? ' aria-label="Cerrar sesión"' : "") + ">" +
            '<span class="nwt-sidebar__menu__icon">' + Ui.icon("cerrar-sesion", { size: 22, color: "currentColor" }) + '</span><span class="nwt-sidebar__footer__logout__label">Cerrar sesión</span>' +
            (colapsado ? '<span aria-hidden="true" class="nwt-sidebar__tooltip">Cerrar sesión</span>' : "") + "</button></div>" +
        "</div></aside>";
    Ui.registerIcon("nwt-casos", '<svg viewBox="0 0 24 24"><path d="M4 6.5h16M4 12h16M4 17.5h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>');
    Ui.registerIcon("nwt-celular", '<svg viewBox="0 0 24 24"><rect x="7" y="2.5" width="10" height="19" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><rect x="10.5" y="18" width="3" height="1.6" rx=".8" fill="currentColor"/></svg>');
    top.innerHTML =
      '<button type="button" class="wtop-movil wtop-casos" data-act="casos" aria-expanded="false" aria-controls="wc-panel" data-testid="web-casos">' + Ui.icon("nwt-casos", { size: 20, color: "currentColor" }) + "<span>Casos</span></button>" +
      '<a class="wtop-movil" href="../../index.html?app=metodologos" data-testid="web-ver-movil">' + Ui.icon("nwt-celular", { size: 20, color: "currentColor" }) + "<span>Ver demo móvil</span></a>" +
      '<div class="wtop-bellw"><button type="button" class="wtop-bell" data-act="web-avisos" data-testid="web-campana" aria-haspopup="dialog" aria-expanded="false" aria-label="Notificaciones' + (n ? ", " + n + " sin leer" : "") + '">' + Ui.icon("nwt-campana", { size: 26, color: "currentColor" }) + insignia(n) + "</button>" +
        '<div class="wtop-avisos" role="dialog" aria-label="Notificaciones" data-testid="web-avisos" hidden></div></div>' +
      '<div class="wtop-user"><button type="button" class="wtop-chip" data-act="web-usuario" data-testid="web-usuario" aria-haspopup="menu" aria-expanded="false">' +
        '<div class="nwt-avatar wtop-av" nwt-size="tiny" nwt-color="blue"><div class="nwt-avatar__content"><span>' + esc(iniciales) + '</span></div></div><span class="wtop-en" aria-hidden="true"></span>' +
        '<span class="wtop-id"><b>' + esc(nombre) + "</b><small>" + esc(u.rol || "Metodólogo") + "</small></span>" + '<span class="wtop-flecha">' + Ui.icon("m-keyboard_arrow_down", { size: 22, color: "currentColor" }) + "</span>" + "</button>" +
        '<div class="wtop-menu" role="menu" hidden><div class="nwt-popover__surface"><div class="nwt-popover__content">' +
          '<span class="wtop-seccion">Mi cuenta</span>' +
          '<a class="nwt-dropdown__option wtop-perfil" role="menuitem" href="#/perfil" data-testid="web-menu-perfil">' + Ui.icon("usuario", { size: 22, color: "currentColor" }) + "<span>Perfil</span></a>" +
        "</div></div></div></div>";
    pie.innerHTML = '<img src="../../../shared/logos/naowee.svg" alt="Naowee" height="24"><span class="wpie-sep" aria-hidden="true"></span><span>Todos los derechos reservados © 2026</span>';
  };

  /* Notificaciones en web: panel bajo la campana (mismo origen de datos que la bandeja móvil, Alertas) */
  const panelAvisos = () => top.querySelector(".wtop-avisos");
  /* Pestañas como en la app: «Recientes» (avisos de hoy) y «Todas». Cada aviso se puede borrar. */
  let tabAvisos = "recientes";
  const pintarAvisos = () => {
    const p = panelAvisos(); if (!p) return;
    const b = Alertas.bandeja(), sin = Alertas.sinLeer(), rec = b.filter((n) => n.grupo === "hoy");
    const items = tabAvisos === "recientes" ? rec : b, nRec = rec.filter((n) => !n.leida).length;
    const tab = (k, t, n, cls) => '<button type="button" role="tab" class="wav-tab' + (tabAvisos === k ? " on" : "") + '" aria-selected="' + (tabAvisos === k) + '" data-act="web-avisos-tab" data-tab="' + k + '" data-testid="web-avisos-tab-' + k + '">' + t + (n ? '<span class="wav-cnt ' + cls + '">' + n + "</span>" : "") + "</button>";
    p.innerHTML = '<div class="wav-head"><h2>Notificaciones</h2><button type="button" class="wav-todas" data-act="web-avisos-todas" data-testid="web-avisos-todas"' + (sin ? "" : " disabled") + ">Marcar como leídas</button></div>" +
      '<div class="wav-tabs" role="tablist">' + tab("recientes", "Recientes", nRec, "rec") + tab("todas", "Todas", b.length, "tod") + "</div>" +
      '<div class="wav-lista">' + (items.length ? items.map((n) =>
        '<div class="wav-row"><button type="button" class="wav-item' + (n.leida ? "" : " nueva") + '" data-id="' + esc(n.id) + '" data-testid="web-aviso-' + esc(n.id) + '"><span class="wav-punto" aria-hidden="true"></span><span class="wav-txt"><b>' + esc(n.tituloTxt) + "</b><span>" + esc(n.mensajeTxt) + "</span><small>" + esc(n.cuando) + "</small></span></button>" +
        '<button type="button" class="wav-del" data-act="web-aviso-borrar" data-id="' + esc(n.id) + '" data-testid="web-aviso-borrar-' + esc(n.id) + '" aria-label="Eliminar notificación" title="Eliminar">' + Ui.icon("papelera", { size: 20, color: "currentColor" }) + "</button></div>").join("")
        : '<p class="wav-vacio">' + (tabAvisos === "recientes" ? "No tienes avisos nuevos." : "No tienes notificaciones.") + "</p>") + "</div>";
  };
  const avisos = (abrir) => {
    const p = panelAvisos(), c = top.querySelector(".wtop-bell"); if (!p) return;
    if (abrir) { menuUsuario(false); pintarAvisos(); }
    p.hidden = !abrir; c.setAttribute("aria-expanded", String(abrir));
  };
  document.addEventListener("click", (e) => {
    const t = e.target;
    if (t.closest("[data-act=web-avisos]")) { const p = panelAvisos(); avisos(p.hidden); }
    else if (t.closest("[data-act=web-avisos-tab]")) { tabAvisos = t.closest("[data-act=web-avisos-tab]").dataset.tab; pintarAvisos(); }
    else if (t.closest("[data-act=web-aviso-borrar]")) {
      const btn = t.closest("[data-act=web-aviso-borrar]"), fila = btn.closest(".wav-row"), id = btn.dataset.id;
      const listo = () => { Alertas.eliminar(id); Ui.actualizarCampana(); pintarAvisos(); };
      /* Salida: la fila se desliza a la derecha y se desvanece, y luego el resto sube al colapsar su altura (≈220 ms) */
      if (!fila || matchMedia("(prefers-reduced-motion: reduce)").matches || fila.dataset.saliendo) return listo();
      fila.dataset.saliendo = "1"; btn.disabled = true;
      const h = fila.offsetHeight, ease = "cubic-bezier(.23,1,.32,1)";
      fila.style.overflow = "hidden";
      fila.animate([{ opacity: 1, transform: "translateX(0)", height: h + "px" }, { opacity: 0, transform: "translateX(24px)", height: h + "px", offset: .55 }, { opacity: 0, transform: "translateX(24px)", height: "0px" }], { duration: 240, easing: ease, fill: "forwards" }).onfinish = listo;
    }
    else if (t.closest("[data-act=web-avisos-todas]")) { Alertas.marcarTodas(); Ui.actualizarCampana(); pintarAvisos(); }
    else if (t.closest(".wav-item")) { const id = t.closest(".wav-item").dataset.id, n = Alertas.bandeja().find((x) => x.id === id); Alertas.marcarLeida(id); Ui.actualizarCampana(); avisos(false); if (n && n.destino) Router.go(n.destino); else if (n) Ui.toast("En la plataforma web se abre la evaluación recibida.", "info", 0, "Solo en la plataforma web"); }
    else if (!t.closest(".wtop-avisos")) avisos(false);
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") avisos(false); });
  /* En escritorio la campana abre el panel; en móvil la campana de la app sigue llevando a la pantalla */

  const menuUsuario = (abrir) => { const m = top.querySelector(".wtop-menu"), c = top.querySelector(".wtop-chip"); if (!m) return; m.hidden = !abrir; c.setAttribute("aria-expanded", String(abrir)); };
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-act=web-colapsar]")) { colapsado = !colapsado; pintar(); }
    else if (e.target.closest("[data-act=web-salir]")) { menuUsuario(false); Session.logout(); Router.go("/login"); }
    else if (e.target.closest("[data-act=web-usuario]")) { const m = top.querySelector(".wtop-menu"); avisos(false); menuUsuario(m.hidden); }
    else menuUsuario(false);
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") menuUsuario(false); });

  /* La insignia se actualiza sola: Ui.actualizarCampana() corre al leer avisos; aquí se refleja el mismo conteo en el menú */
  const baseCampana = Ui.actualizarCampana;
  Ui.actualizarCampana = () => { baseCampana(); const b = top.querySelector(".wside-badge"), n = Alertas.sinLeer(); if (b) { b.querySelector(".nwt-badge__label").textContent = n || ""; b.hidden = !n; } const pa = panelAvisos(); if (pa && !pa.hidden) pintarAvisos(); };

  /* NwtModal en lugar de la hoja inferior (showModalBottomSheet) — solo en escritorio. Mismo contrato que Ui.openSheet:
     {title, body, onMount(el, close), onClose} → {el, close}; el cuerpo queda en .sheet-pad como en la hoja. */
  const hojaMovil = Ui.openSheet;
  let modal = null;
  const cerrarModal = () => { if (modal) modal.close(); };
  Ui.openSheet = (o) => {
    if (!matchMedia(ESCRITORIO).matches) return hojaMovil(o);
    Ui.closeLayer(); cerrarModal();
    const previo = document.activeElement;
    const el = Ui.html('<div class="nwt-modal" role="dialog" aria-modal="true" aria-label="' + esc(o.title) + '" data-testid="web-modal" tabindex="-1">' +
      '<div class="nwt-modal__content"><div class="nwt-modal__header"><div class="nwt-modal__header__description"><span class="wside-titulo">' + esc(o.title) + "</span></div>" +
        '<button type="button" class="nwt-modal__close" data-testid="sheet-cerrar" aria-label="Cerrar">' + Ui.icon("m-close", { size: 24, color: "currentColor" }) + "</button></div>" +
        '<div class="nwt-modal__component"><div class="sheet-pad">' + (o.body || "") + "</div></div></div>" +
      '<div class="nwt-modal__backdrop" data-testid="sheet-scrim"></div></div>');
    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("nwt-modal--visible")));
    let hecho = false;
    const onKey = (e) => { if (e.key === "Escape") api.close(); };
    const api = {
      el,
      close() {
        if (hecho) return; hecho = true; modal = null;
        document.removeEventListener("keydown", onKey);
        el.classList.remove("nwt-modal--visible");
        setTimeout(() => el.remove(), matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 200);
        if (previo && previo.focus && document.contains(previo)) previo.focus();
        if (o.onClose) o.onClose();
      },
    };
    modal = api;
    el.querySelector(".nwt-modal__close").addEventListener("click", api.close);
    el.querySelector(".nwt-modal__backdrop").addEventListener("click", api.close);
    document.addEventListener("keydown", onKey);
    if (o.onMount) o.onMount(el, api.close);
    el.focus({ preventScroll: true });
    return api;
  };
  const cerrarCapa = Ui.closeLayer;
  Ui.closeLayer = () => { cerrarModal(); cerrarCapa(); };

  window.addEventListener("hashchange", () => { cerrarModal(); pintar(); });
  new MutationObserver(() => { if (root.classList.contains("con-menu") !== (Session.isLoggedIn && !SIN_MENU.includes(rutaActual()))) pintar(); }).observe(document.getElementById("app"), { childList: true });
  pintar();
})();
