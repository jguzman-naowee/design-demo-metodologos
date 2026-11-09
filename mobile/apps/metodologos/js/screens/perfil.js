/* Mi perfil (lib/features/perfil/presentation/pages/mi_perfil_page.dart): avatar + rol + Info. Personal + «Cerrar sesión». */
Router.add("/perfil", {
  render() {
    const u = (window.Data && (Data.metodologo || Data.usuario)) || {};
    const nombre = ((Session.user && Session.user.name) || u.nombre || u.name || "").trim() || "Usuario";
    const rol = (Session.user && Session.user.rol) || u.rol || "Metodólogo";
    const email = ((Session.user && Session.user.email) || u.email || "").trim();
    const esc = Ui.esc;
    return Ui.page({
      nav: "perfil", testid: "pantalla-perfil",
      body: '<div class="mp"><h1 class="t-h1">Mi perfil</h1>' +
        '<div class="mp-head"><div class="mp-avatar" data-testid="perfil-avatar" aria-hidden="true">' + esc(nombre[0].toUpperCase()) + "</div>" +
          '<div class="mp-id"><p class="mp-name" data-testid="perfil-nombre">' + esc(nombre) + '</p><p class="mp-role" data-testid="perfil-rol">' + esc(rol) + "</p></div></div>" +
        '<section class="mp-card" data-testid="perfil-info-personal"><h2 class="t-subtitle">Info. Personal</h2>' +
          '<p class="mp-label">Email</p><p class="mp-value" data-testid="perfil-email">' + esc(email || "—") + "</p></section>" +
        '<button type="button" class="btn cream-outlined" data-testid="perfil-cerrar-sesion" data-act="cerrar-sesion"><span class="flip">' + Ui.icon("cerrar-sesion", { size: 20, color: "currentColor" }) + "</span><span>Cerrar sesión</span></button></div>",
    });
  },
  mount(root) {
    Ui.on(root, "click", "[data-act=cerrar-sesion]", () => { Session.logout(); Router.go("/login"); });
  },
});
