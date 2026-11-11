/* Eventos (lib/features/eventos/presentation/pages/eventos_page.dart + widgets/oc_evento_card.dart,
   oc_estado_filter_sheet.dart, oc_aviso_edicion_evento.dart). Búsqueda por nombre + filtro «Estado» (multi) sobre Data.eventos. */
(() => {
  "use strict";
  const ESTADOS = ["En curso", "Programado", "Finalizado"]; /* OcEstadoFilterSheet.opciones */
  const slug = (s) => Data.norm(s).replace(/\s+/g, "-");

  /* Estado de la pantalla: solo en memoria; se reinicia al entrar (la app real recarga al volver) */
  function card(e, avisoAbierto) {
    const sub = e.lugar ? e.fecha + " " + e.lugar : e.fecha;
    const aviso = e.estado === "finalizado" && e.editableUntil; /* avisoEdicionVigente (fecha fija en la demo) */
    const fecha = aviso ? Data.fechaLarga(e.editableUntil) : "", fechaC = aviso ? Data.fechaCorta(e.editableUntil) : "";
    return '<article class="evcard">' +
      '<a class="evcard-link" href="#/evento/' + Ui.esc(e.id) + '" data-testid="evento-card-' + Ui.esc(e.id) + '" aria-label="' + Ui.esc(e.nombre + ", " + e.estadoLabel + ", " + sub) + '">' +
        '<img class="evcard-img" src="' + Ui.esc(e.imagen || Data.eventoGenerico) + '" alt="" loading="lazy" onload="this.classList.add(\'ld\')" onerror="this.onerror=null;this.src=\'' + Data.eventoGenerico + '\'">' +
        '<div class="evcard-body' + (aviso ? " has-aviso" : "") + '">' +
          '<div class="evcard-meta">' + Ui.chip(e.estado, e.estadoLabel) + Ui.icon("arrow-right-select", { size: 20, color: "var(--orange-700)" }) + "</div>" +
          '<h2 class="evcard-title">' + Ui.esc(e.nombre) + "</h2>" +
          '<p class="evcard-sub">' + Ui.esc(sub) + "</p>" +
        "</div>" +
      "</a>" +
      (aviso ? '<div class="evcard-aviso"><div class="nwt-alert nwt-alert--visible" nwt-theme="caution" nwt-variant="quiet" role="button" tabindex="0" data-act="aviso" data-testid="evento-aviso-' + Ui.esc(e.id) + '" aria-expanded="false" aria-label="Plazo de edición hasta el ' + Ui.esc(fecha) + '">' +
        '<div class="nwt-alert__content"><div class="nwt-alert__icon">' + Ui.icon("nwt-exclamacion", { size: 16, color: "currentColor" }) + "</div>" +
        '<span class="nwt-alert__label"><span>Editable hasta el ' + Ui.esc(fechaC) + "</span>" +
        '<span class="aviso-wrap"><span class="aviso-more"><span>Puedes editar las evaluaciones que registraste hasta 10 días después de que termine el evento.</span></span></span></span>' +
        '<span class="av-chev">' + Ui.icon("m-keyboard_arrow_down", { size: 20, color: "currentColor" }) + "</span>" +
        "</div></div></div>" : "") +
    "</article>";
  }

  Router.add("/eventos", {
    render() {
      return Ui.page({
        nav: "eventos", testid: "pantalla-eventos", bodyClass: "tonal",
        body: '<div class="content scroll evs" data-testid="eventos-scroll"><h1 class="t-h1">Eventos</h1>' +
          '<p class="lead">¡Estos son tus eventos asignados para diligenciar!</p>' +
          '<div class="searchrow fija a-sangre" data-testid="eventos-barra">' + Ui.search("", { placeholder: "Buscar por evento", testid: "eventos-buscar" }) +
            '<button type="button" class="trigger" data-testid="eventos-filtro-estado" data-act="filtro-estado" aria-haspopup="dialog"><span>Estado</span>' + Ui.icon("m-keyboard_arrow_down", { size: 24, color: "currentColor" }) + "</button></div>" +
          '<div class="list" data-testid="eventos-lista" aria-live="polite"></div></div>',
      });
    },
    mount(root) {
      const input = root.querySelector("input[type=search]"), trigger = root.querySelector(".trigger"), list = root.querySelector(".list");
      const estados = new Set();
      const sombra = Ui.fijar(root.querySelector(".evs"), root.querySelector(".evs > .searchrow"));

      const filtrados = () => {
        const q = Data.norm(input.value.trim());
        return Data.eventos.filter((e) => (!q || Data.norm(e.nombre).includes(q)) && (!estados.size || estados.has(e.estadoLabel)));
      };
      const paint = () => {
        const hayFiltro = input.value.trim() !== "" || estados.size > 0;
        const items = filtrados();
        list.innerHTML = items.length ? items.map((e) => card(e)).join("")
          : Ui.empty(hayFiltro ? "No encontramos eventos con esos filtros" : "Aún no tienes eventos asignados.", { icon: hayFiltro ? "m-search_off" : "m-event_busy" });
        const activo = estados.size > 0, acento = activo ? "var(--orange-700)" : "var(--black-alpha-100)";
        trigger.classList.toggle("on", activo);
        trigger.querySelector("span").textContent = !activo ? "Estado" : (estados.size === 1 ? [...estados][0] : estados.size + " estados");
        trigger.querySelector(".icbox").style.color = acento;
      };

      /* Las filas entran una tras otra solo al abrir la pantalla; al buscar o filtrar no se animan */
      list.setAttribute("data-enter", ""); setTimeout(() => list.removeAttribute("data-enter"), 900);
      input.addEventListener("input", () => { paint(); sombra(); });
      Ui.on(list, "keydown", "[data-act=aviso]", (e, btn) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); btn.click(); } });
      Ui.on(list, "click", "[data-act=aviso]", (e, btn) => btn.setAttribute("aria-expanded", String(btn.getAttribute("aria-expanded") !== "true")));

      trigger.addEventListener("click", () => {
        const sel = new Set(estados);
        const rows = () => ESTADOS.map((o) => Ui.checkRow({ label: o, checked: sel.has(o), testid: "estado-opcion-" + slug(o) })).join("");
        Ui.openSheet({
          title: "Filtrar por estado",
          body: '<div data-testid="estado-opciones">' + rows() + '</div><div style="height:var(--sp-m-L)"></div>' + Ui.button({ title: "Aplicar", variant: "primary", testid: "estado-aplicar", act: "aplicar" }),
          onMount(el, close) {
            Ui.on(el, "click", ".checkrow", (e, row) => {
              const label = row.dataset.label;
              if (!sel.delete(label)) sel.add(label);
              row.setAttribute("aria-checked", String(sel.has(label)));
            });
            el.querySelector("[data-act=aplicar]").addEventListener("click", () => { estados.clear(); sel.forEach((s) => estados.add(s)); close(); paint(); });
          },
        });
      });
      paint();
    },
  });
})();
