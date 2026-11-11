/* Detalle de evento (#/evento/:id) — lib/features/eventos/presentation/pages/evento_detalle_page.dart y widgets:
   oc_deportes_calificar_section.dart, oc_deportista_filter_sheet.dart, oc_deportista_tile.dart, OcSearchBar, OcSegmentedTabs, OcBackLink.
   Datos fijos (Data.eventos[i].deportistas). Filtros como la app: búsqueda/deporte/género (en la app van al backend) y estado (cliente). */
(() => {
  "use strict";
  const esc = Ui.esc;
  const EXPLICACION = "Estos son los deportes que tienes asignados para calificar en este evento.";
  const slug = (s) => Data.norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  /* DC-030: mayúscula inicial en las palabras de más de 3 letras (de, la, del quedan como están) */
  const titular = (s) => String(s).replace(/\p{L}+/gu, (w) => (w.length > 3 ? w[0].toUpperCase() + w.slice(1) : w));

  /* Material groups_outlined (empty state de la lista) */
  Ui.registerIcon("m-groups_outlined", '<svg viewBox="0 0 24 24"><path d="M12 12.75c1.63 0 3.07.39 4.24.9 1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73 1.17-.52 2.61-.91 4.24-.91zM4 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.13 1.1c-.37-.06-.74-.1-1.13-.1-.99 0-1.93.21-2.78.58C.48 14.9 0 15.62 0 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29zM20 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4 3.43c0-.81-.48-1.53-1.22-1.85-.85-.37-1.79-.58-2.78-.58-.39 0-.76.04-1.13.1.4.68.63 1.46.63 2.29V18H24v-1.57zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"/></svg>');

  /* Hero del detalle (imágenes oficiales compartidas con la plataforma COC); sin entrada se usa la portada de la tarjeta. Único mapeo. */
  const HERO = { e2: "assets/images/hero/hero-intercolegiados.webp", e4: "assets/images/hero/hero-jsj2026.webp", e5: "assets/images/hero/hero-joj2026.webp" };

  /* Estado que sobrevive solo al ir al perfil del deportista y volver (en la app la página sigue en la pila) */
  let saved = null;

  const fila = (n) => '<li class="dfila" data-testid="deporte-pill-' + slug(n) + '">' + Ui.icon(Data.deporteIcono(n), { size: 20, color: "var(--orange-700)" }) + "<span>" + esc(n) + "</span></li>";
  const pill = (n) => '<span class="dpill" data-testid="deporte-pill-' + slug(n) + '">' + Ui.icon(Data.deporteIcono(n), { size: 16, color: "var(--orange-600)" }) + "<span>" + esc(n) + "</span></span>";

  /* Deportes a calificar: una sola fila resumen (iconos apilados, conteo y nombres) que abre la hoja con la lista completa.
     Antes eran un título, un icono de información y pastillas con «+N», y el icono y el «+N» abrían lo mismo. */
  /* Una sola línea de alto fijo: con más de 3 deportes, el primero y «y N más» (el «y N más» siempre queda visible). */
  const nombresResumen = (deportes) => {
    const v = (deportes.length > 3 ? deportes.slice(0, 1) : deportes).map(esc), resto = deportes.length - v.length;
    if (resto > 0) return '<span class="dsum-n">' + v.join(", ") + '</span><span class="dsum-m">&nbsp;y ' + resto + " más</span>";
    return '<span class="dsum-n">' + (v.length > 1 ? v.slice(0, -1).join(", ") + " y " + v[v.length - 1] : v[0]) + "</span>";
  };
  const seccionDeportes = (deportes) => {
    if (!deportes.length) return "";
    const n = deportes.length, pila = deportes.slice(0, 3), mas = n - pila.length;
    return '<button type="button" class="dsum" data-act="deportes-info" data-testid="evento-deportes-calificar" aria-haspopup="dialog" aria-label="' + n + (n === 1 ? " deporte" : " deportes") + " por calificar: " + esc(deportes.join(", ")) + '. Ver lista">' +
      '<span class="dsum-stack" aria-hidden="true">' + pila.map((d) => '<span class="dsum-c">' + Ui.icon(Data.deporteIcono(d), { size: 18, color: "var(--orange-600)" }) + "</span>").join("") + (mas > 0 ? '<span class="dsum-c n">+' + mas + "</span>" : "") + "</span>" +
      '<span class="dsum-t"><b>' + n + (n === 1 ? " deporte" : " deportes") + ' por calificar</b><small>' + nombresResumen(deportes) + "</small></span>" +
      Ui.icon("m-chevron_right", { size: 24, color: "var(--orange-700)" }) + "</button>";
  };

  const tile = (d, evId) => {
    const conj = d.tipo === "Conjunto";
    const disciplina = d.pruebas.length ? d.pruebas[0].nombre : "";
    const titulo = conj ? [d.deporte, disciplina].filter(Boolean).join(" · ") : d.nombre;
    const sub = conj ? d.colegio : (d.categoria ? d.deporte + " - " + d.categoria : d.deporte);
    const extra = conj && d.sexo ? '<span class="dt-extra">' + esc(d.categoria ? d.categoria + " · " + d.sexo : d.sexo) + "</span>" : "";
    return '<a class="dtile" href="#/deportista/' + esc(d.id) + (evId ? "?evento=" + esc(evId) : "") + '" data-testid="deportista-tile-' + esc(d.id) + '" aria-label="' + esc(titulo + ", " + Data.STATUS_LABEL[d.estado]) + '">' +
      '<span class="dt-main">' + Ui.chip(d.estado, Data.STATUS_LABEL[d.estado]) + '<span class="dt-title">' + esc(titulo) + '</span><span class="dt-sub">' + esc(sub) + "</span>" + extra + "</span>" +
      Ui.icon("m-chevron_right", { size: 24, color: "var(--orange-700)" }) + "</a>";
  };

  /* Hoja con el listado completo (showModalBottomSheet sin asa ni cabecera: padding 24) */
  function abrirListado(deportes) {
    const sh = Ui.openSheet({ title: "Deportes a calificar", body: "" });
    sh.el.classList.add("sheet-plain");
    sh.el.querySelectorAll(".sheet-handle,.sheet-head,.sheet-div").forEach((n) => n.remove());
    sh.el.querySelector(".sheet-pad").innerHTML = '<h2 class="t-h2">Deportes a calificar</h2><p class="dsheet-txt">' + esc(EXPLICACION) + '</p><ul class="dlista" data-testid="deportes-sheet-lista">' + deportes.map(fila).join("") + "</ul>";
    sh.el.setAttribute("data-testid", "deportes-sheet");
  }

  /* OcDeportistaFilterSheet */
  function abrirFiltro(ev, filtro, onApply) {
    const f = { deporte: filtro.deporte, estados: new Set(filtro.estados), generos: new Set(filtro.generos) };
    let abierto = false;
    const deportes = Data.deportesOrdenados(ev);
    const chips = (items, sel, pref) => items.map((o) => '<button type="button" class="fchip' + (sel(o.value) ? " sel" : "") + '" aria-pressed="' + sel(o.value) + '" data-v="' + esc(o.value) + '" data-testid="' + pref + slug(o.value) + '">' + esc(o.label) + "</button>").join("");
    const estadosH = () => chips(Data.filtros.estados, (v) => f.estados.has(v), "filtro-estado-");
    const generosH = () => chips(Data.filtros.generos.map((g) => ({ label: g, value: g })), (v) => f.generos.has(v), "filtro-genero-");
    const body =
      '<div class="fs-scroll"><div class="fs-sec"><p class="fs-label">DEPORTE</p><div class="fs-gap8"></div><div data-slot="deporte"></div></div><div class="fs-div"></div>' +
      '<div class="fs-sec chips"><p class="fs-label">ESTADO DE CALIFICACIÓN</p><div class="fs-wrap" data-slot="estados" data-testid="filtro-estados"></div></div><div class="fs-div"></div>' +
      '<div class="fs-sec chips"><p class="fs-label">GÉNERO</p><div class="fs-wrap" data-slot="generos" data-testid="filtro-generos"></div></div></div>' +
      '<div class="fs-div"></div><div class="fs-foot">' + Ui.button({ title: "Limpiar", variant: "tertiary", testid: "filtro-limpiar", act: "limpiar" }) + Ui.button({ title: "Aplicar", variant: "primary", testid: "filtro-aplicar", act: "aplicar" }) + "</div>";
    Ui.openSheet({
      title: "Filtrar deportistas", body,
      onMount(el, close) {
        el.classList.add("sheet-filter"); el.setAttribute("data-testid", "filtro-sheet");
        const slot = (n) => el.querySelector('[data-slot="' + n + '"]');
        /* La lista se crea una sola vez; abrir, cerrar y elegir solo cambian clases, así el desplegable y la flecha se animan. */
        const paintDeporte = () => {
          const opciones = [null].concat(deportes);
          slot("deporte").innerHTML =
            '<button type="button" class="dsel" data-act="deporte-campo" data-testid="filtro-deporte-campo" aria-haspopup="listbox" aria-expanded="false"><span></span>' +
            Ui.icon("m-keyboard_arrow_down", { size: 24, color: "var(--black-alpha-100)" }) + "</button>" +
            '<div class="dmenu-wrap"><div class="dmenu-clip"><div class="dmenu" role="listbox" data-testid="filtro-deporte-menu">' + opciones.map((o) =>
              '<button type="button" role="option" aria-selected="false" class="dopt" data-d="' + esc(o || "") + '" data-testid="filtro-deporte-opcion-' + (o ? slug(o) : "todos") + '"><span>' + esc(o || Data.filtros.todosLosDeportes) + "</span>" + Ui.icon("m-check", { size: 20, color: "var(--orange-700)" }) + "</button>").join("") + "</div></div></div>";
          refrescarDeporte();
        };
        const refrescarDeporte = () => {
          const campo = slot("deporte").querySelector(".dsel"), wrap = slot("deporte").querySelector(".dmenu-wrap"), sp = campo.querySelector("span");
          sp.textContent = f.deporte || Data.filtros.todosLosDeportes; sp.className = f.deporte ? "" : "def";
          campo.classList.toggle("open", abierto); campo.setAttribute("aria-expanded", String(abierto)); wrap.classList.toggle("open", abierto);
          slot("deporte").querySelectorAll(".dopt").forEach((b) => { const sel = (f.deporte || null) === (b.dataset.d || null); b.classList.toggle("sel", sel); b.setAttribute("aria-selected", String(sel)); });
        };
        const paint = () => { paintDeporte(); slot("estados").innerHTML = estadosH(); slot("generos").innerHTML = generosH(); };
        paint();
        Ui.on(el, "click", "[data-act=deporte-campo]", () => { abierto = !abierto; refrescarDeporte(); });
        Ui.on(el, "click", ".dopt", (e, b) => { f.deporte = b.dataset.d || null; abierto = false; refrescarDeporte(); });
        const toggle = (set) => (e, b) => { const v = b.dataset.v; if (!set.delete(v)) set.add(v); b.classList.toggle("sel"); b.setAttribute("aria-pressed", String(set.has(v))); };
        Ui.on(slot("estados"), "click", ".fchip", toggle(f.estados));
        Ui.on(slot("generos"), "click", ".fchip", toggle(f.generos));
        el.querySelector("[data-act=limpiar]").addEventListener("click", () => { f.deporte = null; f.estados.clear(); f.generos.clear(); abierto = false; refrescarDeporte(); slot("estados").innerHTML = estadosH(); slot("generos").innerHTML = generosH(); });
        el.querySelector("[data-act=aplicar]").addEventListener("click", () => { onApply({ deporte: f.deporte, estados: new Set(f.estados), generos: new Set(f.generos) }); close(); });
      },
    });
  }

  Router.add("/evento/:id", {
    render(params) {
      const ev = Data.evento(params.id);
      if (!ev) {
        return Ui.page({ nav: "eventos", testid: "pantalla-evento", body: '<div class="evd"><button type="button" class="backlink" data-act="volver" data-testid="evento-volver" aria-label="Volver">' + Ui.icon("m-chevron_left", { size: 32, color: "var(--orange-700)" }) + "</button>" + Ui.empty("No encontramos este evento", { icon: "m-search_off" }) + "</div>" });
      }
      const deportes = Data.deportesDelEvento(ev), imagen = HERO[ev.id] || ev.imagen;
      /* Hero a sangre: imagen + velo navy que oscurece hacia abajo; sin imagen (o si falla) queda el degradado de marca del fondo */
      const body = '<div class="evd scroll" data-testid="evento-scroll">' +
        '<div class="evd-nombre" aria-hidden="true">' + esc(titular(ev.nombre)) + "</div>" +
        '<header class="evd-hero" data-testid="evento-header">' +
          (imagen ? '<img class="evd-hero-img" src="' + esc(imagen) + '" alt="" decoding="async" onload="this.classList.add(\'ld\')" onerror="this.remove()">' : "") +
          '<span class="evd-hero-veil" aria-hidden="true"></span>' +
          '<button type="button" class="backlink evd-hero-back" data-act="volver" data-testid="evento-volver" aria-label="Volver">' + Ui.icon("m-chevron_left", { size: 32, color: "var(--white-alpha-100)" }) + "</button>" +
          '<div class="evd-hero-in"><span class="evd-chip" data-testid="evento-estado">' + Ui.chip(ev.estado, ev.estadoLabel) + "</span>" +
            '<h1 class="evd-title" data-testid="evento-nombre">' + esc(titular(ev.nombre)) + "</h1>" +
            '<p class="evd-sub" data-testid="evento-fecha-lugar">' + esc(ev.lugar ? ev.fecha + " · " + ev.lugar : ev.fecha) + "</p></div></header>" +
        (deportes.length ? seccionDeportes(deportes) : "") +
        '<div class="evd-gap16"></div><div class="searchrow evd-search">' + Ui.search("", { placeholder: "Buscar deportista", testid: "evento-buscar" }) +
          '<span class="fbtn-wrap"><button type="button" class="fbtn" data-act="filtro" data-testid="evento-filtro" aria-haspopup="dialog" aria-label="Filtrar deportistas">' + Ui.icon("m-filter_list_rounded", { size: 20, color: "currentColor" }) + '</button><span class="fbadge" data-testid="evento-filtro-badge" hidden></span></span></div>' +
        '<div class="evd-gap16"></div><div class="tabs evd-tabs fija a-sangre" role="tablist" data-testid="evento-tabs">' +
          ["Deportes individuales", "Deportes de conjunto"].map((t, i) => '<button type="button" role="tab" class="tab" data-tab="' + i + '" data-testid="evento-tab-' + (i ? "conjunto" : "individuales") + '"><span class="tab-in"><span class="tab-txt">' + t + '</span><span class="tab-bar"></span></span></button>').join("") + "</div>" +
        '<div class="evd-gap16"></div><div class="evd-listhead"><h2 class="t-h2 evd-h2" data-testid="evento-lista-titulo"></h2><span data-testid="evento-contador" class="evd-count"></span></div><div class="evd-gap2"></div>' +
        '<div class="evd-list" data-testid="evento-lista" aria-live="polite"></div></div>';
      return Ui.page({ nav: "eventos", testid: "pantalla-evento", body });
    },
    mount(root, params) {
      const ev = Data.evento(params.id);
      const volver = root.querySelector("[data-act=volver]");
      volver.addEventListener("click", () => Router.back("/eventos"));
      if (!ev) return null;
      const st = saved && saved.id === ev.id ? saved : { id: ev.id, tab: 0, query: "", filtro: { deporte: null, estados: new Set(), generos: new Set() } };
      saved = null;
      const input = root.querySelector("input[type=search]"), list = root.querySelector(".evd-list"), badge = root.querySelector(".fbadge"), fbtn = root.querySelector(".fbtn");
      input.value = st.query;
      const moverTab = Ui.tabIndicator(root.querySelector(".evd-tabs"));
      /* Las filas entran una tras otra solo al abrir la pantalla; al buscar o filtrar no se animan */
      list.setAttribute("data-enter", ""); setTimeout(() => list.removeAttribute("data-enter"), 900);

      const count = () => st.filtro.estados.size + st.filtro.generos.size + (st.filtro.deporte ? 1 : 0);
      const filtrar = () => {
        const q = Data.norm(st.query.trim()), f = st.filtro;
        /* gender solo con EXACTAMENTE un género; deporte y búsqueda como el backend; estado en cliente */
        return ev.deportistas.filter((d) => (st.tab === 1) === (d.tipo === "Conjunto"))
          .filter((d) => !q || [d.nombre, d.deporte, d.colegio].some((s) => Data.norm(s).includes(q)))
          .filter((d) => !f.deporte || d.deporte === f.deporte)
          .filter((d) => f.generos.size !== 1 || d.sexo === [...f.generos][0])
          .filter((d) => !f.estados.size || f.estados.has(d.estado));
      };
      const paint = () => {
        const items = filtrar(), n = count(), hay = st.query.trim() !== "" || n > 0;
        root.querySelectorAll(".tab").forEach((t) => { const on = +t.dataset.tab === st.tab; t.classList.toggle("on", on); t.setAttribute("aria-selected", String(on)); });
        root.querySelector(".evd-h2").textContent = st.tab === 0 ? "Deportistas inscritos" : "Deportes inscritos";
        root.querySelector(".evd-count").innerHTML = Ui.chip("info", String(items.length));
        fbtn.classList.toggle("on", n > 0); badge.hidden = n === 0; badge.textContent = n;
        moverTab(true);
        list.innerHTML = items.length ? items.map((d) => tile(d, ev.id)).join("") : Ui.empty(hay ? "No encontramos deportistas con esos filtros" : "Aún no hay resultados para calificar en esta categoría", { icon: "m-groups_outlined" });
      };

      /* DC-012: un solo scroll (.evd); las pestañas quedan fijas arriba y llevan sombra mientras la lista pasa por debajo */
      const pagina = root.querySelector(".evd"), barra = root.querySelector(".evd-tabs");
      /* Posición natural de la barra: se mide en el separador previo (no es sticky), así sigue valiendo tras cargar fuentes e imágenes */
      const nombre = root.querySelector(".evd-nombre"), altoNombre = () => nombre.offsetHeight;
      const tope = () => pagina.scrollTop + barra.previousElementSibling.getBoundingClientRect().bottom - pagina.getBoundingClientRect().top - altoNombre();
      const sombra = Ui.fijar(pagina, barra);
      /* DC-042: el nombre aparece solo cuando las pestañas están pegadas */
      const verNombre = () => nombre.classList.toggle("on", barra.classList.contains("pegada"));
      pagina.addEventListener("scroll", verNombre, { passive: true }); verNombre();
      input.addEventListener("input", () => { st.query = input.value; paint(); sombra(); });
      Ui.on(root, "click", ".tab", (e, t) => {
        if (+t.dataset.tab === st.tab) return;
        const estaba = sombra();
        st.tab = +t.dataset.tab; paint();
        /* Con la barra pegada, la lista nueva empieza arriba (no a media altura) */
        if (estaba) pagina.scrollTop = tope();
        sombra();
        /* Entrada suave de la lista nueva al cambiar de pestaña (no al buscar ni al filtrar) */
        if (!matchMedia("(prefers-reduced-motion: reduce)").matches) list.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 200, easing: "cubic-bezier(.23,1,.32,1)" });
      });
      Ui.on(root, "click", "[data-act=deportes-info]", () => abrirListado(Data.deportesDelEvento(ev)));
      fbtn.addEventListener("click", () => abrirFiltro(ev, st.filtro, (r) => { st.filtro = r; paint(); sombra(); }));
      paint(); sombra();
      return () => { saved = /^#\/deportista\//.test(location.hash) ? st : null; };
    },
  });
})();
