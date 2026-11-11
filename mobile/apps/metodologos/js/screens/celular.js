/* Inicio del celular (simulado, EXTRA de la demo). No es una pantalla de la app: muestra cómo llegan las alertas automáticas de evaluación
   (js/data-alertas.js) a un celular que tiene la app instalada. Ruta #/celular?ntf=compite|termino|recibida (sin sesión: el celular está bloqueado a la app).
   El aviso baja desde arriba; al tocarlo abre la app en el perfil del deportista (Metodólogo) o avisa que se abre en la plataforma web (Gestor). */
(() => {
  "use strict";

  const g = (inner, o) => '<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" ' + (o || "") + ">" + inner + "</svg>";
  /* Apps del inicio: genéricas (no son marcas reales) salvo la de Metodólogos, que lleva el logo del COC */
  const APPS = [
    { n: "Fotos", cls: "a-fotos", svg: g('<circle cx="12" cy="12" r="5" fill="#fff" opacity=".9"/><circle cx="12" cy="6" r="3" fill="#ffd34e"/><circle cx="18" cy="12" r="3" fill="#ff6b6b"/><circle cx="12" cy="18" r="3" fill="#4ecb71"/><circle cx="6" cy="12" r="3" fill="#4dabf7"/>') },
    { n: "Mapas", cls: "a-mapas", svg: g('<path d="M12 3a6 6 0 0 0-6 6c0 4.5 6 12 6 12s6-7.5 6-12a6 6 0 0 0-6-6z" fill="#fff"/><circle cx="12" cy="9" r="2.4" fill="#2f9e44"/>') },
    { n: "Recordatorios", cls: "a-record", svg: g('<circle cx="6" cy="7" r="1.8" fill="#ff6b6b"/><rect x="10" y="6" width="9" height="2" rx="1" fill="#adb5bd"/><circle cx="6" cy="12" r="1.8" fill="#ffa94d"/><rect x="10" y="11" width="9" height="2" rx="1" fill="#adb5bd"/><circle cx="6" cy="17" r="1.8" fill="#4dabf7"/><rect x="10" y="16" width="9" height="2" rx="1" fill="#adb5bd"/>') },
    { n: "Notas", cls: "a-notas", svg: g('<rect x="5" y="4" width="14" height="16" rx="2" fill="#fff"/><path d="M8 9h8M8 13h8M8 17h5" stroke="#f0b429" stroke-width="1.6" stroke-linecap="round"/>') },
    { n: "Contactos", cls: "a-contactos", svg: g('<circle cx="12" cy="9" r="3.4" fill="#fff"/><path d="M5.5 19c.8-3.6 3.4-5.2 6.5-5.2s5.7 1.6 6.5 5.2z" fill="#fff"/>') },
    { n: "Ajustes", cls: "a-ajustes", svg: g('<circle cx="12" cy="12" r="3.2" fill="none" stroke="#fff" stroke-width="2"/><path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3M6 6l2.1 2.1M15.9 15.9L18 18M18 6l-2.1 2.1M8.1 15.9L6 18" stroke="#fff" stroke-width="2" stroke-linecap="round"/>') },
    { n: "Cámara", cls: "a-camara", svg: g('<rect x="4" y="7" width="16" height="11" rx="2.5" fill="#fff"/><circle cx="12" cy="12.5" r="3" fill="#495057"/>') },
    { n: "Metodólogos", cls: "a-app", app: true, svg: '<img src="assets/images/coc_logo.png" alt="" width="46" height="46">' },
  ];
  const DOCK = [
    { n: "Teléfono", cls: "a-tel", svg: g('<path d="M7 4h3l1.4 4-2 1.3a11 11 0 0 0 5.3 5.3l1.3-2 4 1.4v3a2 2 0 0 1-2.2 2A15 15 0 0 1 5 6.2 2 2 0 0 1 7 4z" fill="#fff"/>') },
    { n: "Navegador", cls: "a-nav", svg: g('<circle cx="12" cy="12" r="8" fill="none" stroke="#fff" stroke-width="1.8"/><path d="M15.5 8.5l-2 5-5 2 2-5z" fill="#fff"/>') },
    { n: "Mensajes", cls: "a-msg", svg: g('<path d="M5 6h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-8l-4 3.5V16H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z" fill="#fff"/>') },
    { n: "Música", cls: "a-music", svg: g('<path d="M10 17V7l9-2v10" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="8" cy="17" r="2.4" fill="#fff"/><circle cx="17" cy="15" r="2.4" fill="#fff"/>') },
  ];
  const app = (a, badge) => '<div class="cel-app' + (a.app ? " is-mine" : "") + '"' + (a.app ? ' role="button" tabindex="0" data-act="abrir-app" data-testid="celular-app"' : "") + '><span class="cel-ico ' + a.cls + '">' + a.svg + (a.app && badge ? '<span class="cel-badge" data-testid="celular-insignia" hidden>1</span>' : "") + "</span><span class=\"cel-lbl\">" + a.n + "</span></div>";

  /* Calendario de agosto de 2026 (empieza en sábado): hoy 11 (martes); los días del evento (9 al 23) llevan un punto */
  const calendario = () => {
    const dias = ["L", "M", "X", "J", "V", "S", "D"];
    let celdas = "";
    for (let i = 0; i < 5; i++) celdas += "<span></span>"; /* 1 de agosto = sábado → 5 huecos con semana desde lunes */
    for (let d = 1; d <= 31; d++) celdas += '<span class="' + (d === 11 ? "hoy" : "") + (d >= 9 && d <= 23 ? " ev" : "") + '">' + d + "</span>";
    return '<div class="cel-w cel-cal"><div class="cel-cal-h"><span>MARTES</span><b>11 ago. 2026</b></div><div class="cel-cal-g">' + dias.map((x) => "<i>" + x + "</i>").join("") + celdas + "</div></div>";
  };

  Router.add("/celular", {
    render(params, ctx) {
      const a = Alertas.aviso((ctx.query && ctx.query.ntf) || "compite");
      const ico = Ui.icon(a.icono, { size: 12, color: "var(--naotech-icon-color)" });
      return '<div class="page cel" data-testid="pantalla-celular" data-ntf="' + Ui.esc(a.id) + '">' +
        '<div class="cel-wall">' +
          '<div class="cel-w cel-clima"><div class="cel-clima-i"><svg viewBox="0 0 24 24" width="34" height="34"><circle cx="12" cy="12" r="5" fill="#ffd34e"/><g stroke="#ffd34e" stroke-width="2" stroke-linecap="round"><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8"/></g></svg></div>' +
            '<div class="cel-clima-t"><b>Soleado</b><small>Panamá · Mín 24° Máx 33°</small></div><span class="cel-clima-g">32°</span></div>' +
          '<div class="cel-row">' + calendario() +
            '<div class="cel-col"><div class="cel-w cel-ev"><div class="cel-ev-h"><span>PRÓXIMO EVENTO</span></div><b>Hoy · 10:00 a. m.</b><small>NATACIÓN · 50 M LIBRE</small></div>' +
              '<div class="cel-w cel-bat"><div><span>BATERÍA</span><b>80%</b><small>Quedan 23 h</small></div><span class="cel-bat-r"></span></div></div></div>' +
          '<p class="cel-sec">Widgets</p>' +
          '<div class="cel-apps">' + APPS.map((x) => app(x, true)).join("") + "</div>" +
          '<div class="cel-dock">' + DOCK.map((x) => app(x, false)).join("") + "</div>" +
        "</div>" +
        '<button type="button" class="ntf" nwt-theme="' + Ui.esc(a.tema) + '" data-act="abrir-aviso" data-testid="notif-banner" aria-label="Notificación de ' + Ui.esc(a.app) + ": " + Ui.esc(a.tituloTxt) + '">' +
          '<span class="ntf-ico"><img src="assets/images/coc_logo.png" alt="" width="34" height="34"><span class="nwt-avatar-icon ntf-badge" aria-hidden="true">' + ico + "</span></span>" +
          '<span class="ntf-body"><span class="ntf-top"><span class="ntf-app">' + Ui.esc(a.app) + '</span><time>ahora</time></span>' +
            '<b class="ntf-t">' + Ui.esc(a.tituloTxt) + '</b><span class="ntf-m">' + Ui.esc(a.mensajeTxt) + "</span></span></button>" +
      "</div>";
    },
    mount(root, params, ctx) {
      const a = Alertas.aviso((ctx.query && ctx.query.ntf) || "compite");
      const ntf = root.querySelector(".ntf"), badge = root.querySelector(".cel-badge");
      /* El aviso baja a los 250 ms; la insignia de la app aparece con él */
      const t = setTimeout(() => { ntf.classList.add("in"); if (badge) badge.hidden = false; }, 250);
      const abrir = (ruta) => { Session.login(); Router.go(ruta); };
      Ui.on(root, "click", "[data-act=abrir-aviso]", () => {
        if (a.destino) abrir(a.destino);
        else Ui.toast("En la plataforma web se abre la evaluación recibida; aquí no hay plataforma.", "info", 0, "Solo en la plataforma web");
      });
      Ui.on(root, "click", "[data-act=abrir-app]", () => abrir("/eventos"));
      Ui.on(root, "keydown", "[data-act=abrir-app]", (e, el) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); el.click(); } });
      return () => clearTimeout(t);
    },
  });
})();
