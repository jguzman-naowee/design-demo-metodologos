/* Formulario de evaluación (lib/features/evaluacion/presentation/pages/evaluacion_formulario_page.dart).
   Rutas:  #/evaluacion/:deportistaId/:pruebaId            individual (o conjunto: el sujeto decide por esEquipo)
           #/evaluacion-conjunto/:equipoId/:pruebaId       mismo formulario para equipos
   pruebaId = posición de la prueba en d.pruebas (0, 1…) o su nombre.  Query opcional: ?modo=ver | ?modo=editar
   Sin query: crear. «editar» solo entra en edición si
   la evaluación es editable (editIntent de la app); si no, queda en solo lectura con el aviso del plazo.
   Sin red: «Guardar» cambia el estado en memoria (Evaluaciones.save) y vuelve. */
(() => {
  "use strict";
  const esc = Ui.esc;
  Ui.registerIcon("m-priority_high", '<svg viewBox="0 0 24 24"><path d="M10 3h4v12h-4z M10 17h4v4h-4z" fill="currentColor"/></svg>');

  const CAMPOS = [
    { k: "technicalAspect", t: "Evaluación aspecto técnico", ph: "Concepto sobre el desempeño técnico del deportista en la prueba." },
    { k: "tacticalAspect", t: "Evaluación aspecto táctico", ph: "Concepto sobre el desempeño táctico del deportista en la prueba." },
    { k: "physicalPreparation", t: "Evaluación preparación física", ph: "Concepto sobre el nivel de preparación física del deportista." },
    { k: "conclusions", t: "Conclusiones", ph: "Síntesis del desempeño general del deportista en la prueba." },
    { k: "recommendations", t: "Recomendaciones", ph: "Orientaciones de cara a la preparación o próximas competencias." },
  ];
  const GRIP = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M12 3.6 3.6 12M12 8.16 8.16 12" stroke="var(--gray-500)" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>';

  /* OcTextField (campo de referencia bloqueado) */
  const refField = (titulo, valor, id) =>
    '<div class="ef-field" data-testid="evaluacion-campo-' + id + '"><div class="ef-title"><label for="ef-' + id + '">' + esc(titulo) + "</label></div>" +
    '<div class="ef-box disabled ref"><input id="ef-' + id + '" type="text" value="' + esc(valor) + '" disabled aria-readonly="true"></div></div>';

  /* OcTextField editable o bloqueado (datos diligenciados) */
  const campo = (o) => {
    const area = o.area, dis = o.disabled, id = o.k;
    const inner = area
      ? '<textarea id="ef-' + id + '" data-k="' + id + '" placeholder="' + esc(o.ph || "") + '" maxlength="1000"' + (dis ? " disabled" : "") + ' data-testid="evaluacion-input-' + id + '">' + esc(o.v || "") + "</textarea>" +
        '<div class="ef-grip" data-grip aria-hidden="true">' + GRIP + "</div>"
      : '<input id="ef-' + id + '" data-k="' + id + '" type="text" inputmode="numeric" pattern="[0-9]*" placeholder="' + esc(o.ph || "") + '" value="' + esc(o.v || "") + '"' + (dis ? " disabled" : "") + ' autocomplete="off" data-testid="evaluacion-input-' + id + '">';
    return '<div class="ef-field" data-field="' + id + '" data-testid="evaluacion-campo-' + id + '">' +
      '<div class="ef-title"><label for="ef-' + id + '">' + esc(o.t) + '</label><span class="ef-req" aria-hidden="true">*</span></div>' +
      '<div class="ef-box' + (area ? " area" : "") + (dis ? " disabled" : "") + '">' + inner + "</div>" +
      (area ? '<div class="ef-counter" data-counter>' + String((o.v || "").length) + "/1000</div>" : "") +
      '<div class="ef-cap" data-cap hidden role="alert">' + Ui.icon("cancelar", { size: 16, color: "var(--error-700)" }) + "<span></span></div></div>";
  };

  /* Pantalla de carga al enviar: el mismo logo animado del inicio de sesión (Ui.logoAnimado), un ciclo completo en CARGA_MS */
  const CARGA_MS = 2000;
  const loader = () => '<div class="oc-loader" data-testid="evaluacion-cargando" role="status" aria-label="Cargando">' + Ui.logoAnimado({ tamano: 132, dur: CARGA_MS }) + "</div>";

  function render(params, ctx, conjunto) {
    const d = Data.deportistaById(params.id), idx = d ? Evaluaciones.pruebaIndex(d, params.prueba) : -1;
    if (!d || idx < 0) {
      return Ui.page({ nav: "eventos", testid: "pantalla-evaluacion", body: Ui.empty("No encontramos esta evaluación.") });
    }
    return Ui.page({ nav: "eventos", testid: "pantalla-evaluacion", body: '<div class="ef-scroll scroll" data-testid="evaluacion-scroll"></div>' });
  }

  function mount(root, params, ctx) {
    const d = Data.deportistaById(params.id), idx = d ? Evaluaciones.pruebaIndex(d, params.prueba) : -1;
    if (!d || idx < 0) return;
    const p = d.pruebas[idx];
    const scroll = root.querySelector(".ef-scroll");
    const op0 = Evaluaciones.get(d.id, idx);
    const modoVer = ctx.query.modo === "ver";
    const editIntent = ctx.query.modo === "editar";
    let editando = !!(op0 && editIntent && op0.editable);
    const esEquipo = !!d.esEquipo;
    const volver = () => Router.back("/deportista/" + encodeURIComponent(d.id) + "?evento=" + encodeURIComponent(p.eventoId || "e1"));
    let validated = false, opinion = op0, confirm = null;
    const readOnly = () => !!op0 && !editando && (modoVer || editIntent);

    const val = {}; /* valores de los campos (los controla el DOM; se leen al guardar) */
    const v0 = opinion || {};
    const inicial = { countries: v0.countries || "", athletesCount: v0.athletesCount != null ? String(v0.athletesCount) : "" };
    CAMPOS.forEach((c) => { inicial[c.k] = v0[c.k] || ""; });

    /* Fechas: "2026-09-02" → "2 de septiembre de 2026" */
    const infoEdicion = () => {
      if (!opinion) return "";
      const u = opinion.editableUntil;
      if (opinion.editable) return u ? '<div class="ef-ro-info">' + Ui.alertaMute("informative", "Puedes editar esta evaluación hasta el " + esc(Data.fechaLarga(u)) + ".", "evaluacion-aviso-plazo") + "</div>" : "";
      return u ? '<div class="ef-ro-info">' + Ui.alertaMute("negative", "El plazo de edición terminó el " + esc(Data.fechaLarga(u)) + ".", "evaluacion-aviso-plazo") + "</div>" : "";
    };

    function pintar() {
      const ro = readOnly(), dis = ro;
      const evNombre = ((Data.evento(p.eventoId || "e1") || {}).nombre || "");
      const nombreEquipo = d.colegio ? d.colegio : d.nombre;
      scroll.innerHTML =
        Ui.topbar(evNombre || "Formulario de evaluación", "evaluacion-barra") +
        '<a class="backlink" href="#/" data-act="volver" data-testid="evaluacion-volver" aria-label="Volver">' + Ui.icon("m-chevron_left", { size: 32, color: "var(--orange-700)" }) + "</a>" +
        '<h1 class="t-h1 ef-h1">' + (evNombre ? esc(evNombre) + '<small class="ef-ev">Formulario de evaluación</small>' : "Formulario de evaluación") + "</h1>" +
        '<p class="ef-desc">Completa el formulario con la evaluación técnico-metodológica del deportista. </p>' +
        '<div class="ef-div"></div>' +
        (ro ? '<div class="ef-banner-wrap"><div class="oc-banner" data-testid="evaluacion-banner-solo-lectura">' + Ui.icon("check", { size: 20, color: "var(--success-text)" }) + "<span>Evaluación registrada · solo lectura</span></div>" + infoEdicion() + "</div>" : "") +
        '<div class="ef-section first" style="margin-top:var(--sp-m-L)" data-testid="evaluacion-seccion-1">' + (esEquipo ? "1. Identificación del equipo" : "1. Identificación del deportista") + "</div>" +
        '<p class="ef-caption ef-pre">Datos precargados desde la inscripción.</p>' +
        (esEquipo
          ? refField("Deporte", d.deporte, "deporte") + '<div class="ef-gap"></div>' + refField("Delegación / institución", nombreEquipo, "delegacion")
          : refField("Nombre del deportista", d.nombre, "nombre") + '<div class="ef-gap"></div>' + refField("Deporte", d.deporte, "deporte")) +
        (d.modalidad ? '<div class="ef-gap"></div>' + refField("Modalidad", d.modalidad, "modalidad") : "") +
        '<div class="ef-gap"></div>' + refField("Prueba", p.nombre, "prueba") +
        '<div class="ef-section" data-testid="evaluacion-seccion-2">2. Contexto de la prueba</div>' +
        '<div class="ef-field" data-field="countries" data-testid="evaluacion-campo-countries"><div class="ef-title"><label for="ef-countries">Países en la prueba</label></div>' +
          '<div class="ef-box' + (dis ? " disabled" : "") + '"><input id="ef-countries" data-k="countries" type="text" placeholder="Ej: Colombia, Brasil, México" value="' + esc(inicial.countries) + '"' + (dis ? " disabled" : "") + ' autocomplete="off" data-testid="evaluacion-input-countries"></div></div>' +
        '<p class="ef-caption ef-hint">Opcional. Nombres de países separados por coma.</p>' +
        '<div class="ef-gap"></div>' + campo({ k: "athletesCount", t: "No. de atletas en la prueba", ph: "Ej: 12", v: inicial.athletesCount, disabled: dis }) +
        '<div class="ef-section" data-testid="evaluacion-seccion-3">3. Evaluación técnico-metodológica</div>' +
        CAMPOS.slice(0, 3).map((c) => campo({ k: c.k, t: c.t, ph: c.ph, v: inicial[c.k], area: true, disabled: dis })).join('<div class="ef-gap"></div>') +
        '<div class="ef-section" data-testid="evaluacion-seccion-4">4. Cierre de la evaluación</div>' +
        CAMPOS.slice(3).map((c) => campo({ k: c.k, t: c.t, ph: c.ph, v: inicial[c.k], area: true, disabled: dis })).join('<div class="ef-gap"></div>') +
        (ro
          ? '<div class="ef-end">' + Ui.button({ title: "Volver al perfil", variant: "cream-outlined", testid: "evaluacion-volver-perfil", act: "volver" }) + "</div>"
          : '<div class="ef-actions">' + Ui.button({ title: "Cancelar", variant: "tertiary", size: "medium", testid: "evaluacion-cancelar", act: "cancelar" }) +
            Ui.button({ title: "Guardar evaluación", size: "medium", testid: "evaluacion-guardar", act: "guardar" }) + "</div>");
      /* El enlace ‹ usa el historial (como Navigator.maybePop) */
      /* Cada campo (modo editable) conserva lo escrito en `inicial` para repintar sin perderlo */
    }

    /* ── Validación (_athletesError / _requiredError) ── */
    const leer = (k) => { const el = scroll.querySelector('[data-k="' + k + '"]'); return el ? el.value : inicial[k]; };
    const errAtletas = () => { const t = leer("athletesCount").trim(); if (!t) return "Ingresa el número de atletas."; const n = parseInt(t, 10); return isNaN(n) || n <= 0 ? "Ingresa un número válido." : null; };
    const errReq = (k) => (leer(k).trim() ? null : "Este campo es obligatorio.");
    const errores = () => {
      const m = { athletesCount: errAtletas() };
      CAMPOS.forEach((c) => { m[c.k] = errReq(c.k); });
      return m;
    };
    function marcar() {
      const m = errores();
      Object.keys(m).forEach((k) => {
        const f = scroll.querySelector('[data-field="' + k + '"]'); if (!f) return;
        const box = f.querySelector(".ef-box"), cap = f.querySelector("[data-cap]");
        box.classList.toggle("error", !!m[k]); cap.hidden = !m[k];
        cap.querySelector("span:last-child").textContent = m[k] || "";
      });
      return m;
    }
    const hayErrores = (m) => Object.keys(m).some((k) => m[k]);

    pintar();
    Ui.seguirTitulo(scroll, scroll.querySelector(".ef-h1"));

    /* ── Eventos ── */
    const onClick = (e) => {
      const a = e.target.closest("[data-act]"); if (!a || !scroll.contains(a)) return;
      if (a.dataset.act === "volver" || a.dataset.act === "cancelar") { e.preventDefault(); volver(); }
      else if (a.dataset.act === "guardar") guardar();
    };
    scroll.addEventListener("click", onClick);

    /* Contador, solo dígitos y revalidación en vivo (después del primer intento de guardar) */
    scroll.addEventListener("input", (e) => {
      const el = e.target; if (!el.dataset || !el.dataset.k) return;
      if (el.dataset.k === "athletesCount") { const s = el.value.replace(/\D/g, ""); if (s !== el.value) el.value = s; }
      inicial[el.dataset.k] = el.value;
      const f = el.closest(".ef-field"), c = f && f.querySelector("[data-counter]"); if (c) c.textContent = el.value.length + "/1000";
      if (validated) marcar();
    });

    /* Tocar fuera de un campo quita el foco y cierra el teclado; arrastrar el scroll también (onDrag) */
    const quitarFoco = () => { const a = document.activeElement; if (a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA")) a.blur(); };
    scroll.addEventListener("pointerdown", (e) => { if (!e.target.closest(".ef-box") && !e.target.closest("button,a")) quitarFoco(); });
    let down = null;
    scroll.addEventListener("pointerdown", (e) => { down = { x: e.clientX, y: e.clientY }; });
    scroll.addEventListener("pointermove", (e) => { if (down && e.pointerType === "touch" && Math.abs(e.clientY - down.y) > 8) { quitarFoco(); down = null; } });
    scroll.addEventListener("touchmove", quitarFoco, { passive: true });
    const finDrag = () => { down = null; };
    scroll.addEventListener("pointerup", finDrag); scroll.addEventListener("pointercancel", finDrag);

    /* Grip del textArea: alto entre 96 y 420 arrastrando la esquina */
    scroll.addEventListener("pointerdown", (e) => {
      const g = e.target.closest("[data-grip]"); if (!g) return;
      e.preventDefault(); const box = g.parentElement; let y = e.clientY;
      g.setPointerCapture(e.pointerId);
      const mv = (ev) => { const h = box.getBoundingClientRect().height + (ev.clientY - y); y = ev.clientY; box.style.height = Math.max(96, Math.min(420, h)) + "px"; };
      const up = () => { g.removeEventListener("pointermove", mv); g.removeEventListener("pointerup", up); g.removeEventListener("pointercancel", up); };
      g.addEventListener("pointermove", mv); g.addEventListener("pointerup", up); g.addEventListener("pointercancel", up);
    });

    /* ── Guardar → OcConfirmScreen ── */
    function guardar() {
      quitarFoco();
      validated = true;
      const m = marcar();
      if (hayErrores(m)) { Ui.toast("Revisa los campos obligatorios.", "warning", 6000, "Faltan campos"); return; }
      const esEdicion = editando && !!op0;
      const host = document.getElementById("app");
      confirm = Ui.html('<div class="ef-confirm" data-testid="evaluacion-confirmar" role="dialog" aria-modal="true" aria-label="' + (esEdicion ? "Confirmar cambios" : "Confirmar envío") + '"></div>');
      host.appendChild(confirm);
      const vista = () => {
        confirm.innerHTML = '<div class="ef-confirm-in"><div class="ef-confirm-ico">' + Ui.icon("m-priority_high", { size: 24, color: "var(--white-alpha-100)" }) + "</div>" +
          '<h2 class="t-h2">' + (esEdicion ? "Confirmar cambios" : "Confirmar envío") + "</h2>" +
          "<p>" + (esEdicion
            ? "Vas a guardar los cambios de esta evaluación. Asegúrate de que toda la información sea correcta."
            : "Estás a punto de enviar el formulario. Después del envío podrás editar esta calificación dentro del plazo habilitado. Asegúrate de que toda la información sea correcta.") + "</p>" +
          Ui.button({ title: "Sí, enviar", variant: "primary", testid: "evaluacion-confirmar-si", act: "si" }) +
          Ui.button({ title: "No, seguir editando", variant: "cream-outlined", leftIcon: "flecha-izquierda", testid: "evaluacion-confirmar-no", act: "no" }) + "</div>";
      };
      vista();
      confirm.addEventListener("click", (e) => {
        const a = e.target.closest("[data-act]"); if (!a) return;
        if (a.dataset.act === "no") { confirm.remove(); confirm = null; return; }
        if (a.dataset.act === "si") enviar(esEdicion);
      });
    }

    function enviar(esEdicion) {
      /* Loader a pantalla completa (bloquea toda acción); al terminar cierra la confirmación y vuelve */
      confirm.innerHTML = loader();
      setTimeout(() => {
        if (!confirm) return;
        const valores = {
          countries: leer("countries").trim(), athletesCount: parseInt(leer("athletesCount").trim(), 10),
          technicalAspect: leer("technicalAspect").trim(), tacticalAspect: leer("tacticalAspect").trim(), physicalPreparation: leer("physicalPreparation").trim(),
          conclusions: leer("conclusions").trim(), recommendations: leer("recommendations").trim(),
        };
        const op = Evaluaciones.save(d, idx, valores);
        if (!esEdicion && window.PerfilRecientes && PerfilRecientes.marcar) PerfilRecientes.marcar(d.id, idx, { fecha: d.pruebas[idx].fecha, evaluador: d.pruebas[idx].evaluador, editableUntil: op.editableUntil });
        confirm.remove(); confirm = null;
        const msg = esEdicion ? "Evaluación actualizada" : "Evaluación registrada";
        /* El snackbar se muestra sobre la pantalla a la que se vuelve (ScaffoldMessenger de la app) */
        const mostrar = () => { window.removeEventListener("hashchange", mostrar); setTimeout(() => Ui.toast("Quedó guardada en el historial del deportista.", "success", 0, msg), 30); };
        window.addEventListener("hashchange", mostrar);
        volver();
      }, CARGA_MS);
    }

    return () => { if (confirm) { confirm.remove(); confirm = null; } };
  }

  Router.add("/evaluacion/:id/:prueba", { render: (p, c) => render(p, c, false), mount });
  Router.add("/evaluacion-conjunto/:id/:prueba", { render: (p, c) => render(p, c, true), mount });
})();
