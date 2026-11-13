/* Mi perfil (lib/features/perfil/presentation/pages/mi_perfil_page.dart): avatar + rol + Info. Personal + «Cerrar sesión». */
Router.add("/perfil", {
  render() {
    const u = (window.Data && (Data.metodologo || Data.usuario)) || {};
    const nombre = ((Session.user && Session.user.name) || u.nombre || u.name || "").trim() || "Usuario";
    const rol = (Session.user && Session.user.rol) || u.rol || "Metodólogo";
    const email = ((Session.user && Session.user.email) || u.email || "").trim();
    const esc = Ui.esc;
    /* Escritorio: misma estructura que los perfiles del deportista (cabecera en tarjeta, columna «Perfil» y tarjeta con los datos) */
    if (document.documentElement.classList.contains("web") && matchMedia("(min-width:900px)").matches) {
      return Ui.page({
        nav: "perfil", testid: "pantalla-perfil", scroll: true,
        body: '<div class="pf" data-testid="perfil-contenido"><div class="pfw" data-testid="perfil-web">' +
          '<section class="pfw-head" data-testid="perfil-header"><div class="pf-avatar" data-testid="perfil-avatar" aria-hidden="true"><span>' + esc(nombre[0].toUpperCase()) + "</span></div>" +
            '<div class="pfw-id"><p class="pfw-eyebrow">Perfil del metodólogo</p><div class="pfw-name"><h1 class="t-h2" data-testid="perfil-nombre">' + esc(nombre) + '</h1><span class="pfw-meta" data-testid="perfil-rol">' + esc(rol) + "</span></div></div></section>" +
          '<div class="pfw-cols"><aside class="pfw-side"><div class="pfw-nav" aria-current="page">' + Ui.icon("m-person_outline", { size: 24, color: "currentColor" }) + "<span>Perfil</span></div></aside>" +
            '<section class="pfw-main" data-testid="perfil-info-personal"><h2 class="t-h2 pfw-tit">Info. Personal</h2>' +
              '<div class="pfw-grid"><div class="pfw-campo"><span class="pfw-label">Email</span><div class="pfw-valor" data-testid="perfil-email">' + esc(email || "—") + "</div></div></div>" +
              "</section></div></div></div>",
      });
    }
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
    Ui.on(root, "click", "[data-act=volver]", (e) => { e.preventDefault(); Router.back("/eventos"); });
    Ui.on(root, "click", "[data-act=cerrar-sesion]", () => { Session.logout(); Router.go("/login"); });
  },
});
