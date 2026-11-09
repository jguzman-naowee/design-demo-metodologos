/* Login (lib/features/auth/presentation/pages/login_page.dart). «Ingresar» abre la pantalla «Iniciar sesión» (Keycloak), que entra con la sesión simulada. */
Router.add("/login", {
  render() {
    return '<div class="page page-safe" data-testid="pantalla-login"><div class="login">' +
      '<div class="login-mid"><img src="assets/images/coc_logo.png" alt="Comité Olímpico Colombiano" width="110" height="110">' +
      '<h1 class="t-h1">¡Bienvenido!</h1><p>Ingresa con tu cuenta del Comité Olímpico Colombiano.</p></div>' +
      Ui.button({ title: "Ingresar", variant: "dark", testid: "login-ingresar", act: "ingresar" }) +
    "</div></div>";
  },
  mount(root) {
    Ui.on(root, "click", "[data-act=ingresar]", () => Router.go("/iniciar-sesion"));
  },
});
