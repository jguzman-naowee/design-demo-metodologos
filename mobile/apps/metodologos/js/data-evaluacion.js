/* Evaluaciones en memoria (agente C). Extiende Data de forma aditiva: window.Evaluaciones.
   La app real registra la opinión con POST y la lee con GET; aquí «Guardar» solo cambia el estado en memoria
   (se pierde al recargar). coc_sample.dart no trae opiniones de ejemplo: para las pruebas ya «Calificado» de los datos
   fijos se muestra una opinión de muestra (textos de demostración) en el formulario de solo lectura.

   API
     Evaluaciones.pruebaIndex(d, ref)   índice de la prueba por posición ("0") o por nombre; -1 si no existe
     Evaluaciones.get(depId, idx)       opinión guardada | opinión de muestra (si la prueba ya viene calificada) | null
     Evaluaciones.save(d, idx, valores) registra (o actualiza) y marca la PruebaVm como calificada (muta Data en memoria):
                                        estado, fecha ("Mar, 01 2026. 4:29 PM"), evaluador, alreadyEvaluated, editable, editableUntil
     Evaluaciones.formatFechaHora(date) formatFechaHora de shared/utils/date_format.dart
   Opinión = { countries, athletesCount, technicalAspect, tacticalAspect, physicalPreparation, conclusions, recommendations,
               editable, editableUntil (AAAA-MM-DD o "") } */
(() => {
  "use strict";
  const D = window.Data;
  const store = {};
  const key = (depId, idx) => depId + "|" + idx;

  const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const formatFechaHora = (dt) => {
    const h = dt.getHours(), mm = String(dt.getMinutes()).padStart(2, "0");
    return MESES[dt.getMonth()] + ", " + String(dt.getDate()).padStart(2, "0") + " " + dt.getFullYear() + ". " + (h % 12 === 0 ? 12 : h % 12) + ":" + mm + " " + (h < 12 ? "AM" : "PM");
  };

  /* Plazo fijo (10 días tras el fin del evento en curso, 23 Ago. 2026): la demo no usa la fecha del sistema para ser determinista */
  const PLAZO_EDICION = "2026-09-02";

  const MUESTRA = {
    countries: "Colombia, Brasil, México",
    athletesCount: 8,
    technicalAspect: "Buena ejecución técnica en general, con una salida y una transición bien resueltas. Se observa margen de mejora en la consistencia del gesto en la parte final de la prueba.",
    tacticalAspect: "Lee bien la prueba y administra el esfuerzo de forma adecuada; toma decisiones oportunas frente a sus rivales directos.",
    physicalPreparation: "Nivel de preparación física acorde con la categoría. Mantiene el ritmo hasta el cierre sin señales de fatiga marcada.",
    conclusions: "Desempeño sólido y competitivo para el nivel de la prueba, con proyección de crecimiento.",
    recommendations: "Reforzar el trabajo de resistencia específica y la técnica en la fase final de cara a las próximas competencias.",
  };

  const pruebaIndex = (d, ref) => {
    if (!d) return -1;
    if (/^\d+$/.test(String(ref))) { const i = Number(ref); return i < d.pruebas.length ? i : -1; }
    return d.pruebas.findIndex((p) => D.norm(p.nombre) === D.norm(ref));
  };

  const get = (depId, idx) => {
    const guardada = store[key(depId, idx)];
    if (guardada) return guardada;
    const d = D.deportistaById(depId), p = d && d.pruebas[idx];
    if (p && p.estado === "calificado") {
      return Object.assign({}, MUESTRA, { editable: !!p.editable, editableUntil: p.editableUntil || "" });
    }
    return null;
  };

  const save = (d, idx, v) => {
    const p = d.pruebas[idx], k = key(d.id, idx), previa = store[k] || get(d.id, idx);
    const nueva = !previa;
    const op = Object.assign({}, v, {
      /* Registrada: el backend la devuelve editable dentro del plazo (DEP-419) */
      editable: previa ? previa.editable : true,
      editableUntil: previa ? previa.editableUntil : PLAZO_EDICION,
    });
    store[k] = op;
    if (nueva) {
      p.estado = "calificado";
      p.alreadyEvaluated = true;
      p.fecha = formatFechaHora(new Date());
      p.evaluador = (D.metodologo || D.usuario || {}).nombre || (D.usuario && D.usuario.name) || "";
      p.editable = op.editable;
      p.editableUntil = op.editableUntil;
      /* Estado efectivo del sujeto: Calificado solo si TODAS sus pruebas lo están */
      d.estado = d.pruebas.every((x) => x.estado === "calificado") ? "calificado" : "sinCalificacion";
    }
    return op;
  };

  window.Evaluaciones = { pruebaIndex, get, save, formatFechaHora, PLAZO_EDICION };
})();
