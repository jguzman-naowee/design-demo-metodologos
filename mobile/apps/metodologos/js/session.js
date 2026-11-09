/* Sesión de mentira, SOLO en memoria (se pierde al recargar: cada caso parte limpio).
   La app real inicia sesión con Keycloak en un WebView; aquí «Ingresar» entra directo con el usuario fijo de Data. */
(() => {
  "use strict";
  /* `?sesion=1` (la usan los casos que no son el de login) arranca con la sesión de mentira ya iniciada. */
  let user = new URLSearchParams(location.search).has("sesion") ? Data.usuario : null;
  window.Session = {
    get user() { return user; },
    get isLoggedIn() { return !!user; },
    login() { user = Data.usuario; return user; },
    logout() { user = null; },
  };
})();
