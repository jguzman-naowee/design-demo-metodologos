/* Iniciar sesión: la pantalla de Keycloak que la app abre en un WebView (auth_webview_page.dart: barra «‹ Iniciar sesión» de la app + formulario web).
   Demo: no pide ni valida datos. «Iniciar sesión» entra con la sesión simulada aunque los campos estén vacíos. */
Router.add("/iniciar-sesion", {
  render() {
    const proximamente = (act, texto) => '<button type="button" class="is-link" data-act="' + act + '">' + texto + "</button>";
    return '<div class="page page-safe" data-testid="pantalla-iniciar-sesion"><div class="is">' +
      '<div class="is-bar"><button type="button" class="backlink" data-act="volver" data-testid="iniciar-sesion-volver" aria-label="Volver">' +
        Ui.icon("m-chevron_left", { size: 32, color: "var(--orange-700)" }) + '</button><h2 class="t-h2">Iniciar sesión</h2></div>' +
      '<form class="is-web" novalidate autocomplete="off" data-testid="iniciar-sesion-form">' +
        '<img class="is-logo" src="assets/images/coc_logo.png" alt="Comité Olímpico Colombiano">' +
        "<h1>¡Bienvenido de vuelta!</h1>" +
        '<label class="is-label" for="is-correo">Correo electrónico <span aria-hidden="true">*</span></label>' +
        '<input class="is-input" id="is-correo" type="email" inputmode="email" placeholder="correo@ejemplo.com" autocomplete="off" data-testid="iniciar-sesion-correo">' +
        '<label class="is-label" for="is-clave">Contraseña <span aria-hidden="true">*</span></label>' +
        '<div class="is-pass"><input class="is-input" id="is-clave" type="password" placeholder="Ingresa tu contraseña" autocomplete="off" data-testid="iniciar-sesion-clave">' +
          '<button type="button" class="is-eye" data-act="ver-clave" data-testid="iniciar-sesion-ojo" aria-label="Mostrar contraseña" aria-pressed="false">' + Ui.icon("ojo-cerrado", { size: 24, color: "var(--orange-700)" }) + "</button></div>" +
        '<p class="is-olvido">¿Olvidaste la contraseña? ' + proximamente("recuperar", "Recuperar") + "</p>" +
      "</form>" +
      '<div class="is-pie">' +
        Ui.button({ title: "Iniciar sesión", variant: "dark", testid: "iniciar-sesion-enviar", act: "iniciar-sesion" }) +
        '<p class="is-legal">' + proximamente("politica", "Política de tratamiento de datos") + " <span>y</span> " + proximamente("terminos", "Términos y condiciones") + "</p>" +
      "</div></div></div>";
  },
  mount(root) {
    const input = root.querySelector("#is-clave"), ojo = root.querySelector("[data-act=ver-clave]");
    Ui.on(root, "click", "[data-act=volver]", () => Router.back("/login"));
    Ui.on(root, "click", "[data-act=ver-clave]", () => {
      const ver = input.type === "password";
      input.type = ver ? "text" : "password";
      ojo.setAttribute("aria-pressed", String(ver));
      ojo.setAttribute("aria-label", ver ? "Ocultar contraseña" : "Mostrar contraseña");
      ojo.querySelector(".icbox").innerHTML = Ui.icon(ver ? "ojo-abierto" : "ojo-cerrado", { size: 24, color: "var(--orange-700)" }).replace(/^<span[^>]*>|<\/span>$/g, "");
    });
    Ui.on(root, "click", "[data-act=recuperar],[data-act=politica],[data-act=terminos]", () => Ui.toast("Esta opción todavía no está disponible.", "info", 0, "Próximamente"));
    /* Sin validación ni datos: entra con la sesión de mentira. */
    Ui.on(root, "click", "[data-act=iniciar-sesion]", () => { Session.login(); Router.go("/eventos"); });
    root.querySelector("form").addEventListener("submit", (e) => { e.preventDefault(); Session.login(); Router.go("/eventos"); });
  },
});
