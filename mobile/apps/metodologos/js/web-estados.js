/* Estados de carga, error, sin conexión y vacío de la plataforma web (propuesta, no existen en la app).
   El marco elige el modo (localStorage + Estados.set); en «normal» cada pantalla muestra su skeleton un momento. */
(() => {
  "use strict";
  const root = document.documentElement;
  if (!root.classList.contains("web")) return;
  const K = "naowee.web.estado", AUTO_MS = 650, MODOS = ["normal", "cargando", "error", "sinconexion", "vacio"];
  const leer = () => { try { const v = localStorage.getItem(K); return MODOS.includes(v) ? v : "normal"; } catch (_) { return "normal"; } };
  let modo = leer(), listo = null, timer = 0;

  /* ruta → [clave, nav del menú] */
  const RUTAS = [[/^\/eventos$/, "eventos", "eventos"], [/^\/evento\/[^/]+$/, "evento", "eventos"], [/^\/deportista\/[^/]+$/, "deportista", "eventos"], [/^\/perfil$/, "perfil", "perfil"]];
  const TXT = {
    eventos: { err: "No pudimos cargar tus eventos", vacio: ["Aún no tienes eventos asignados", "Cuando te asignen un evento para evaluar, aparecerá aquí."] },
    evento: { err: "No pudimos cargar el evento", vacio: ["Este evento aún no tiene deportistas inscritos", "Cuando se inscriban deportistas, podrás calificarlos desde aquí."] },
    deportista: { err: "No pudimos cargar el perfil del deportista", vacio: ["Este deportista aún no tiene pruebas", "Cuando se le asignen pruebas, podrás calificarlas desde aquí."] },
    perfil: { err: "No pudimos cargar tu perfil", vacio: ["Aún no hay datos en tu perfil", "Tus datos personales aparecerán aquí."] },
  };

  const sk = (w, h, extra) => '<span class="sk' + (extra ? " " + extra : "") + '" style="width:' + w + ";height:" + h + 'px"></span>';
  const lineas = (n, h) => Array.from({ length: n }, (_, i) => sk(["70%", "45%", "60%", "35%", "55%"][i % 5], h || 16)).join("");
  const SKEL = {
    eventos: () => sk("240px", 40) + sk("380px", 18) +
      '<div class="sk-fila">' + sk("100%", 48, "sk-pill sk-crece") + sk("156px", 48) + "</div>" +
      '<div class="sk-grid">' + Array.from({ length: 6 }, () => '<div class="sk-card sk-evc">' + sk("100%", 140, "sk-img") + '<div class="sk-in">' + sk("80%", 22) + sk("50%", 22) + '<hr class="sk-hr">' + lineas(2, 14) + "</div></div>").join("") + "</div>",
    evento: () => sk("160px", 20) + sk("100%", 240, "sk-bloque") + sk("100%", 72, "sk-bloque") +
      '<div class="sk-card sk-in">' + '<div class="sk-fila">' + sk("170px", 22) + sk("170px", 22) + "</div>" + sk("240px", 28) +
        '<div class="sk-fila">' + sk("336px", 48, "sk-pill") + sk("150px", 48) + sk("160px", 48) + "</div>" + sk("100%", 40) +
        Array.from({ length: 5 }, () => '<div class="sk-tr">' + sk("22%", 16) + sk("16%", 16) + sk("12%", 16) + sk("10%", 16) + sk("12%", 22, "sk-pill") + "</div>").join("") + "</div>",
    deportista: () => sk("160px", 20) + '<div class="sk-card sk-head">' + sk("88px", 88, "sk-circ") + '<div class="sk-col">' + sk("160px", 14) + sk("300px", 28) + sk("220px", 18) + "</div></div>" +
      sk("90px", 28) + '<div class="sk-card sk-in"><div class="sk-fila">' + sk("70px", 22) + sk("80px", 22) + sk("80px", 22) + "</div>" + sk("220px", 26) +
        '<div class="sk-campos">' + Array.from({ length: 6 }, () => '<div class="sk-col">' + sk("90px", 12) + sk("180px", 20) + "</div>").join("") + "</div></div>",
    perfil: () => '<div class="sk-card sk-head">' + sk("88px", 88, "sk-circ") + '<div class="sk-col">' + sk("160px", 14) + sk("320px", 28) + "</div></div>" +
      sk("90px", 28) + '<div class="sk-card sk-in">' + sk("180px", 26) + '<div class="sk-col">' + sk("60px", 12) + sk("240px", 20) + "</div></div>",
  };

  const aviso = (clave, tipo) => {
    const off = tipo === "sinconexion", vac = tipo === "vacio";
    const [t, p] = vac ? TXT[clave].vacio : off ? ["Sin conexión a internet", "Revisa tu conexión y vuelve a intentarlo."] : [TXT[clave].err, "Ocurrió un problema al consultar la información. Inténtalo de nuevo en unos segundos."];
    const ico = vac ? (clave === "eventos" ? "m-event_busy" : "m-search_off") : "m-error_outline";
    return '<div class="est-msg est-' + tipo + '"' + (vac ? "" : ' role="alert"') + ' data-testid="estado-' + tipo + '"><span class="est-ico" aria-hidden="true">' + Ui.icon(ico, { size: 32, color: "currentColor" }) + "</span>" +
      '<h2 class="est-h">' + t + '</h2><p class="est-p">' + p + "</p>" +
      (vac ? "" : Ui.button({ title: "Reintentar", variant: "primary", size: "medium", testid: "estado-reintentar", act: "estado-reintentar" })) + "</div>";
  };
  const pagina = (r, cuerpo, cargando) => Ui.page({ nav: r[2], scroll: true, testid: "pantalla-" + r[1],
    body: '<div class="est est--' + r[1] + '"' + (cargando ? ' aria-busy="true" role="status" aria-label="Cargando"' : "") + ' data-testid="estado-pantalla">' + cuerpo + "</div>" });

  const programar = (path) => { timer = setTimeout(() => { listo = path; Router.refresh(); }, AUTO_MS); };

  window.Estados = {
    get modo() { return modo; },
    /* Lo llama el router antes de pintar: devuelve la página de estado o null para pintar la real */
    antes(path) {
      clearTimeout(timer);
      const r = RUTAS.find((x) => x[0].test(path));
      if (!r || !matchMedia("(min-width:900px)").matches) { listo = null; return null; }
      const yaCargo = listo === path; listo = null;
      if (modo === "vacio") return pagina(r, aviso(r[1], "vacio"));
      if (modo === "cargando") return pagina(r, SKEL[r[1]](), true);
      if (yaCargo) return modo === "normal" ? null : pagina(r, aviso(r[1], modo));
      programar(path); return pagina(r, SKEL[r[1]](), true);
    },
    /* Envíos (guardar evaluación): fallan en los modos de error */
    falla() { return modo === "error" || modo === "sinconexion" ? modo : null; },
    set(v) { modo = MODOS.includes(v) ? v : "normal"; try { localStorage.setItem(K, modo); } catch (_) {} listo = null; Router.refresh(); },
  };
  document.addEventListener("click", (e) => { if (e.target.closest("[data-act=estado-reintentar]")) { listo = null; Router.refresh(); } });
})();
