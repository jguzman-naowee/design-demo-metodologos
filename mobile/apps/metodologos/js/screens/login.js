/* Login con splash «Noche olímpica»: el splash se arma sobre navy y se transforma en el formulario (sin pantalla intermedia ni Keycloak).
   Demo: no pide ni valida datos; «Iniciar sesión» entra con la sesión simulada. */
(() => {
  "use strict";
  const IMG = "assets/images/coc_logo_";
  const LETRAS = [[3.628, 12.576], [16.989, 13.301], [32.044, 6.227], [38.875, 13.301], [53.748, 13.362], [69.287, 8.283], [79.262, 2.418], [82.95, 12.455]];
  const AROS = ["32.06% 41.2%", "40.79% 69.44%", "49.51% 41.2%", "58.35% 69.44%", "67.2% 41.2%"];
  const SPLASH_MS = 3000;
  /* Fotos del panel de la versión web (web.css): [archivo, object-position]; rotan con un fundido cada 5 s */
  const FOTOS = [["panama", "50% 40%"], ["medallista", "50% 22%"], ["dakar", "50% 62%"], ["arqueria", "30% 50%"], ["podio", "50% 38%"]];
  let splashVisto = false; /* una vez por arranque: al cerrar sesión se vuelve directo al formulario */

  const logo = () =>
    '<div class="lg-logo" role="img" aria-label="Comité Olímpico Colombiano"><div class="lg-logo-in">' +
      '<img class="sp-wave" src="' + IMG + 'wave.png" alt="">' +
      '<div class="sp-word">' + LETRAS.map((l, k) => '<img class="lg-pc ink" style="left:' + l[0] + "%;width:" + l[1] + "%;--d:" + (650 + 55 * k) + 'ms" src="' + IMG + "l" + k + '.png" alt="">').join("") + "</div>" +
      '<div class="sp-rings">' + AROS.map((o, k) => '<img class="lg-pc lg-ring' + (k === 2 ? " ink" : "") + '" style="transform-origin:' + o + ";--d:" + (1150 + 120 * k) + 'ms" src="' + IMG + "r" + k + '.png" alt="">').join("") + "</div>" +
    "</div></div>";

  const proximamente = (act, texto) => '<button type="button" class="lg-link" data-act="' + act + '">' + texto + "</button>";

  Router.add("/login", {
    render() {
      const reducido = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
      const fase = splashVisto || reducido ? "login" : "idle";
      return '<div class="page lg" data-fase="' + fase + '" data-testid="pantalla-login">' +
        '<div class="lg-bg"></div>' +
        '<svg class="lg-orbit" aria-hidden="true" viewBox="0 0 390 844" preserveAspectRatio="xMidYMin slice" fill="none" stroke="#DFB550" stroke-width="1.2">' +
          '<circle cx="195" cy="300" r="90"/><circle cx="195" cy="300" r="150" stroke-dasharray="3 9"/><circle cx="195" cy="300" r="225"/><circle cx="195" cy="300" r="310" stroke-dasharray="3 9"/></svg>' +
        logo() +
        '<div class="lg-name" aria-hidden="true"><div class="lg-name-t">Ciclo<br>Olímpico</div><div class="lg-rule"></div></div>' +
        /* Solo versión web (web.css): franja superior (el logo del Comité viaja del splash a ella) y panel de imagen a la izquierda; en móvil están ocultos */
        '<div class="lg-web lg-top"></div>' +
        '<div class="lg-web lg-panel" aria-hidden="true">' + FOTOS.map((f, i) => '<img class="lg-panel-img" style="--i:' + i + ';--pos:' + f[1] + '" src="assets/images/login/' + f[0] + '.jpg" alt="" ' + 'loading="lazy">').join("") + '</div>' +
        '<div class="lg-main">' +
        '<div class="lg-head"><h1>Ciclo Olímpico</h1></div>' +
        '<div class="lg-web lg-bienv"><h2>Bienvenido a <b>Ciclo Olímpico</b> <span aria-hidden="true">👋</span></h2><p>Ingresa tus credenciales para acceder a tu perfil y evaluar a tus deportistas.</p></div>' +
        '<form class="lg-form" novalidate autocomplete="off" data-testid="login-form">' +
          '<label class="lg-label" for="lg-correo">Correo electrónico <span aria-hidden="true">*</span></label>' +
          '<input class="lg-input" id="lg-correo" type="email" inputmode="email" placeholder="correo@ejemplo.com" autocomplete="off" data-testid="login-correo">' +
          '<label class="lg-label" for="lg-clave">Contraseña <span aria-hidden="true">*</span></label>' +
          '<div class="lg-pass"><input class="lg-input" id="lg-clave" type="password" placeholder="Ingresa tu contraseña" autocomplete="off" data-testid="login-clave">' +
            '<button type="button" class="lg-eye" data-act="ver-clave" data-testid="login-ojo" aria-label="Mostrar contraseña" aria-pressed="false">' + Ui.icon("ojo-cerrado", { size: 24, color: "var(--orange-700)" }) + "</button></div>" +
          '<p class="lg-olvido">¿Olvidaste la contraseña? ' + proximamente("recuperar", "Recuperar") + "</p>" +
        "</form>" +
        '<div class="lg-foot">' +
          Ui.button({ title: "Iniciar sesión", variant: "dark", testid: "login-ingresar", act: "iniciar-sesion" }) +
          '<p class="lg-legal">' + proximamente("politica", "Política de tratamiento de datos") + " <span>y</span> " + proximamente("terminos", "Términos y condiciones") + "</p>" +
        "</div>" +
        '<div class="lg-web lg-ayuda"><b>¿Necesitas ayuda?</b><p>Si tienes dudas o problemas con tu cuenta, puedes comunicarte con el equipo de soporte</p>' + proximamente("soporte", "soporte@naowee.com") + "</div>" +
        "</div>" +
        '<div class="lg-web lg-pie"><img src="../../../shared/logos/naowee.svg" alt="Naowee" height="28"><span>Todos los derechos reservados © 2026</span></div>' +
        '<img class="lg-min" src="assets/images/mindeporte.svg" alt="Ministerio del Deporte">' +
        '<div class="lg-carga" aria-hidden="true"><span></span></div>' +
      "</div>";
    },
    mount(root) {
      const pg = root.querySelector(".lg"), input = root.querySelector("#lg-clave"), ojo = root.querySelector("[data-act=ver-clave]");
      const timers = [];
      if (pg.dataset.fase === "idle") {
        splashVisto = true;
        timers.push(setTimeout(() => { pg.dataset.fase = "splash"; }, 80));
        timers.push(setTimeout(() => { pg.dataset.fase = "login"; }, SPLASH_MS));
      }
      Ui.on(root, "click", "[data-act=ver-clave]", () => {
        const ver = input.type === "password";
        input.type = ver ? "text" : "password";
        ojo.setAttribute("aria-pressed", String(ver));
        ojo.setAttribute("aria-label", ver ? "Ocultar contraseña" : "Mostrar contraseña");
        ojo.innerHTML = Ui.icon(ver ? "ojo-abierto" : "ojo-cerrado", { size: 24, color: "var(--orange-700)" });
      });
      Ui.on(root, "click", "[data-act=recuperar],[data-act=politica],[data-act=terminos],[data-act=soporte]", () => Ui.toast("Esta opción todavía no está disponible.", "info", 0, "Próximamente"));
      const entrar = () => { Session.login(); Router.go("/eventos"); };
      Ui.on(root, "click", "[data-act=iniciar-sesion]", entrar);
      root.querySelector("form").addEventListener("submit", (e) => { e.preventDefault(); entrar(); });
      return () => timers.forEach(clearTimeout);
    },
  });
})();
