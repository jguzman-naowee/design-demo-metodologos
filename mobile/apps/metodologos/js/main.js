/* Arranque: guard de sesión y primera ruta. La app arranca en #/login, que trae el splash. */
(() => {
  "use strict";
  const PUBLICAS = ["/login"];
  /* app_router.dart::_guard: sin sesión solo /login; con sesión, /login → /eventos */
  Router.guard((path) => {
    if (path === "/celular") return null; /* inicio del celular simulado (alertas): se ve con o sin sesión */
    if (!Session.isLoggedIn) return PUBLICAS.includes(path) ? null : "/login";
    return PUBLICAS.includes(path) ? "/eventos" : null;
  });
  Router.start("/login");
})();
