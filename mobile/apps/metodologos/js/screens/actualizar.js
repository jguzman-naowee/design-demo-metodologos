/* Pantalla de actualización obligatoria (lib/features/app_guard/presentation/pages/update_required_page.dart).
   Sin salida: sin appbar ni navegación. La app muestra el botón «Actualizar» solo si hay URL de tienda; por defecto (app aún
   sin publicar) no hay botón. Con ?tienda=1 se pinta el botón (la demo no abre la tienda). */
Router.add("/actualizar", {
  render(p, ctx) {
    const hayTienda = ctx && ctx.query && ctx.query.tienda === "1";
    return Ui.page({
      appBar: false, testid: "pantalla-actualizar",
      body: '<div class="up scroll"><img class="up-logo" src="assets/images/coc_logo.png" alt="" width="80" height="80">' +
        '<h1 class="t-h2" data-testid="actualizar-titulo">Nueva versión disponible</h1>' +
        '<p data-testid="actualizar-texto">Una nueva versión se encuentra disponible, por favor actualice la aplicación.</p>' +
        (hayTienda ? Ui.button({ title: "Actualizar", testid: "actualizar-boton", act: "actualizar" }) : "") + "</div>",
    });
  },
  mount(root) {
    Ui.on(root, "click", "[data-act=actualizar]", () => Ui.toast("En la app real se abre la tienda de aplicaciones; aquí no hay tienda.", "info"));
  },
});
