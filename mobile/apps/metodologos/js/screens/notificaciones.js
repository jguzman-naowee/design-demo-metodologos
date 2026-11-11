/* Bandeja de notificaciones (EXTRA de la demo, js/data-alertas.js): los avisos automáticos de evaluación que ya llegaron al metodólogo.
   Título con el icono de doble chulo («Marcar todas como leídas»), pestañas «Recientes» y «Todas» (con sus contadores) y filas planas. Alcance: solo la bandeja;
   tocar un aviso lleva al perfil del deportista y lo marca como leído. Sin preferencias ni ajustes. Ruta #/notificaciones. */
(() => {
  "use strict";
  const esc = Ui.esc;
  const GRUPOS = [["recientes", "Recientes", "hoy"], ["todas", "Todas", null]]; /* «Todas» lista todos los avisos, los recientes y los anteriores */

  const fila = (n) =>
    '<button type="button" class="nt-item' + (n.leida ? "" : " nueva") + '" nwt-theme="' + esc(n.tema) + '" data-id="' + esc(n.id) + '" data-testid="notificacion-' + esc(n.id) + '">' +
      '<span class="nt-av" aria-hidden="true"><span class="nt-ini">' + esc(n.nombre.charAt(0).toUpperCase()) + '</span><span class="nwt-avatar-icon nt-ico">' + Ui.icon(n.icono, { size: 11, color: "var(--naotech-icon-color)" }) + "</span></span>" +
      '<span class="nt-body"><span class="nt-t"><b>' + esc(n.nombre) + "</b> " + esc(n.accionTxt) + '</span>' +
        '<span class="nt-h">' + esc(n.cuando) + " · " + esc(n.pruebaTxt) + '</span><span class="nt-ev">' + esc(n.eventoTxt) + "</span></span>" +
      (n.leida ? "" : '<span class="nt-punto" aria-label="Sin leer"></span>') + "</button>";

  Router.add("/notificaciones", {
    render() {
      return Ui.page({
        nav: "eventos", testid: "pantalla-notificaciones", scroll: true,
        body: '<div class="content nt"><a class="backlink" href="#/eventos" data-act="volver" data-testid="notificaciones-volver" aria-label="Volver">' + Ui.icon("m-chevron_left", { size: 32, color: "var(--orange-700)" }) + "</a>" +
          '<div class="nt-head"><h1 class="t-h2">Notificaciones</h1><button type="button" class="nt-todas" data-act="todas" data-testid="notificaciones-marcar-todas" aria-label="Marcar todas como leídas" title="Marcar todas como leídas">' + Ui.icon("nwt-doble-check", { size: 26, color: "currentColor" }) + "</button></div>" +
          '<div class="tabs nt-tabs" role="tablist" data-testid="notificaciones-tabs">' + GRUPOS.map((g, i) => '<button type="button" role="tab" class="tab' + (i ? "" : " on") + '" aria-selected="' + (i ? "false" : "true") + '" data-tab="' + i + '" data-testid="notificaciones-tab-' + g[0] + '"><span class="tab-in"><span class="tab-txt">' + g[1] + ' <span class="nt-cnt" data-cnt="' + i + '"></span></span><span class="tab-bar"></span></span></button>').join("") + "</div>" +
          '<div class="nt-lista" data-testid="notificaciones-lista" aria-live="polite"></div></div>',
      });
    },
    mount(root) {
      const cont = root.querySelector(".nt-lista"), todas = root.querySelector("[data-act=todas]");
      const mover = Ui.tabIndicator(root.querySelector(".nt-tabs"));
      let tab = 0, listo = false;
      const paint = () => {
        const b = Alertas.bandeja(), grupo = GRUPOS[tab][2], items = grupo ? b.filter((n) => n.grupo === grupo) : b;
        cont.innerHTML = items.length ? items.map(fila).join("") : Ui.empty(tab ? "No tienes notificaciones." : "No tienes avisos nuevos.", { icon: "nwt-campana" });
        /* Contadores: Recientes = avisos sin leer (píldora oscura, se oculta en 0); Todas = cuántos hay en total */
        const sin = b.filter((n) => n.grupo === "hoy" && !n.leida).length, ant = b.length;
        const c0 = root.querySelector('[data-cnt="0"]'), c1 = root.querySelector('[data-cnt="1"]');
        /* Si el contador se vacía no se borra el número: la píldora se encoge con el número visible y luego queda oculta */
        const antes = c0.classList.contains("vacio") + "|" + c1.classList.contains("vacio");
        if (sin) c0.textContent = sin; c0.classList.toggle("vacio", !sin);
        if (ant) c1.textContent = ant; c1.classList.toggle("vacio", !ant);
        todas.disabled = Alertas.sinLeer() === 0;
        Ui.actualizarCampana();
        /* Si un contador aparece o desaparece, la pestaña cambia de ancho poco a poco: el subrayado la sigue cuadro a cuadro (no en la primera pintada) */
        if (listo && antes !== c0.classList.contains("vacio") + "|" + c1.classList.contains("vacio")) seguir(340);
      };
      const seguir = (ms) => { const t0 = performance.now(), f = () => { mover(false); if (performance.now() - t0 < ms) requestAnimationFrame(f); }; f(); };
      paint(); listo = true;
      Ui.on(root, "click", ".tab", (e, t) => {
        if (+t.dataset.tab === tab) return;
        tab = +t.dataset.tab;
        root.querySelectorAll(".tab").forEach((x) => { const on = x === t; x.classList.toggle("on", on); x.setAttribute("aria-selected", String(on)); });
        mover(true); paint();
        if (!matchMedia("(prefers-reduced-motion: reduce)").matches) cont.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 200, easing: "cubic-bezier(.23,1,.32,1)" });
      });
      Ui.on(root, "click", ".nt-item", (e, el) => { const n = Alertas.bandeja().find((x) => x.id === el.dataset.id); Alertas.marcarLeida(el.dataset.id); Ui.actualizarCampana(); if (n) Router.go(n.destino); });
      todas.addEventListener("click", () => { Alertas.marcarTodas(); paint(); });
      root.querySelector("[data-act=volver]").addEventListener("click", (e) => { e.preventDefault(); Router.back("/eventos"); });
    },
  });
})();
