/* Arranque: guard de sesión y primera ruta. Sin splash ni BootGate: la app arranca en #/login. */
(() => {
  "use strict";
  const PUBLICAS = ["/login", "/iniciar-sesion"];
  /* app_router.dart::_guard: sin sesión solo /login; con sesión, /login → /eventos */
  Router.guard((path) => {
    if (!Session.isLoggedIn) return PUBLICAS.includes(path) ? null : "/login";
    return PUBLICAS.includes(path) ? "/eventos" : null;
  });
  Router.start("/login");
})();
