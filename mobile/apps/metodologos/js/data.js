/* Datos fijos de la demo. Copia fiel de lib/shared/sample/coc_sample.dart (mismos textos y mismos ids).
   La demo no consulta servicios: todo lo que la app real pide al gateway sale de aquí.
   Se expone como window.Data. Es solo lectura: el estado que cambia vive en memoria (Session, o el que guarde cada pantalla).

   Estados (OcStatus): "calificado" | "sinCalificacion" | "enCurso" | "programado" | "finalizado" | "info".
   Ids de evento: e1, e2 (de coc_sample) y e3 (EXTRA de la demo, ver abajo). Ruta de detalle: #/evento/<id>. */
(() => {
  "use strict";

  const IMG = "assets/images/";
  const STATUS_LABEL = { calificado: "Calificado", sinCalificacion: "Sin calificación", enCurso: "En curso", programado: "Programado", finalizado: "Finalizado", info: "" };

  /* PruebaVm */
  const prueba = (nombre, estado, extra) => Object.assign({ nombre, estado, eventoId: "e1", fecha: null, evaluador: null, evaluable: false, blockedReason: "", alreadyEvaluated: false, editable: false, editableUntil: "" }, extra || {});

  /* DeportistaVm */
  const deportista = (o) => Object.assign({ tipo: "Individual", colegio: "", modalidad: "", clasificacionFuncional: "", sexo: "", targetType: "ATHLETE", esMiembroEquipo: false, pruebas: [], miembros: [] }, o);

  const EVALUADOR = "Juan José Pérez Granados";

  /* Muestra de deportistas del evento en curso (individuales) */
  const individuales = [
    deportista({ id: "d1", nombre: "Javier Manríquez", deporte: "Paraatletismo", categoria: "Prejuvenil", estado: "sinCalificacion", colegio: "Colegio San Ignacio", modalidad: "Pista", clasificacionFuncional: "F11", sexo: "Hombre",
      pruebas: [
        prueba("100m planos", "calificado", { fecha: "Mar, 01 2026 · 4:29 PM", evaluador: EVALUADOR }),
        prueba("Salto largo", "sinCalificacion"),
        /* EXTRA de la demo: historial en varios eventos del ciclo, con dos eventos en curso a la vez (e1 y e4) */
        prueba("Lanzamiento de bala", "sinCalificacion", { eventoId: "e4" }),
        prueba("Relevo 4x100", "calificado", { eventoId: "e4", fecha: "Jue, 05 2026 · 9:40 AM", evaluador: EVALUADOR, editable: true, editableUntil: "2026-09-02" }),
        prueba("100m planos", "calificado", { eventoId: "e3", fecha: "Sáb, 07 2026 · 11:20 AM", evaluador: EVALUADOR, alreadyEvaluated: true, editableUntil: "2026-03-18" }),
      ] }),
    deportista({ id: "d2", nombre: "Valentina Ríos", deporte: "Paranatación", categoria: "Juvenil", estado: "sinCalificacion", colegio: "Colegio La Enseñanza", modalidad: "Piscina", clasificacionFuncional: "S10", sexo: "Mujer",
      pruebas: [prueba("50m libre", "sinCalificacion")] }),
    deportista({ id: "d3", nombre: "Andrés Camacho", deporte: "Ciclismo", categoria: "Prejuvenil", estado: "sinCalificacion", colegio: "Colegio Nacional", modalidad: "Ruta", clasificacionFuncional: "C4", sexo: "Hombre",
      pruebas: [prueba("Contrarreloj", "sinCalificacion")] }),
    deportista({ id: "d4", nombre: "Laura Restrepo", deporte: "Gimnasia", categoria: "Juvenil", estado: "sinCalificacion", colegio: "Gimnasio Moderno", modalidad: "Artística", clasificacionFuncional: "—", sexo: "Mujer",
      pruebas: [prueba("Suelo", "sinCalificacion")] }),
    deportista({ id: "d5", nombre: "Mariana López", deporte: "Tenis de mesa", categoria: "Juvenil", estado: "calificado", colegio: "Liceo Francés", modalidad: "Individual", clasificacionFuncional: "—", sexo: "Mujer",
      pruebas: [prueba("Individual", "calificado", { fecha: "Lun, 28 2026 · 10:15 AM", evaluador: EVALUADOR })] }),
  ];

  /* Integrante de un equipo: deportista individual con una prueba = el deporte */
  const miembro = (id, nombre, dep, sexo, colegio, estado) => deportista({
    id, nombre, deporte: dep, categoria: "Juvenil", estado, tipo: "Conjunto", colegio, sexo,
    pruebas: [prueba(dep, estado, estado === "calificado" ? { fecha: "Mié, 03 2026 · 2:00 PM", evaluador: EVALUADOR } : {})],
  });

  const miembrosBaloncesto = [
    miembro("c1-m1", "Sofía Vargas", "Baloncesto", "Mujer", "Colegio Nueva Granada", "sinCalificacion"),
    miembro("c1-m2", "Daniela Rojas", "Baloncesto", "Mujer", "Colegio Nueva Granada", "sinCalificacion"),
    miembro("c1-m3", "Carolina Suárez", "Baloncesto", "Mujer", "Colegio Nueva Granada", "sinCalificacion"),
    miembro("c1-m4", "Melissa Cárdenas", "Baloncesto", "Mujer", "Colegio Nueva Granada", "sinCalificacion"),
  ];
  const miembrosVoleibol = [
    miembro("c2-m1", "Valentina Gómez", "Voleibol", "Mujer", "Colegio La Enseñanza", "calificado"),
    miembro("c2-m2", "Laura Peña", "Voleibol", "Mujer", "Colegio La Enseñanza", "calificado"),
    miembro("c2-m3", "Camila Torres", "Voleibol", "Mujer", "Colegio La Enseñanza", "calificado"),
  ];
  const miembrosFutbolSala = [
    miembro("c3-m1", "Andrés Gómez", "Fútbol sala", "Hombre", "Colegio Nacional", "sinCalificacion"),
    miembro("c3-m2", "Julián Mesa", "Fútbol sala", "Hombre", "Colegio Nacional", "sinCalificacion"),
    miembro("c3-m3", "Samuel Ortiz", "Fútbol sala", "Hombre", "Colegio Nacional", "sinCalificacion"),
  ];

  /* Equipos (deportes de conjunto): tipo "Conjunto" y con miembros => "Perfil del deporte" */
  const conjunto = [
    deportista({ id: "c1", nombre: "Selección de Baloncesto", deporte: "Baloncesto", categoria: "Juvenil", estado: "sinCalificacion", tipo: "Conjunto", colegio: "Colegio Nueva Granada", modalidad: "5x5", sexo: "Mujer",
      pruebas: [prueba("Fase de grupos", "sinCalificacion")], miembros: miembrosBaloncesto }),
    deportista({ id: "c2", nombre: "Selección de Voleibol", deporte: "Voleibol", categoria: "Juvenil", estado: "calificado", tipo: "Conjunto", colegio: "Colegio La Enseñanza", modalidad: "Sala", sexo: "Mujer",
      pruebas: [
        prueba("Semifinal", "calificado", { fecha: "Mié, 03 2026 · 2:00 PM", evaluador: EVALUADOR, editable: true, editableUntil: "2026-09-02" }),
        /* EXTRA de la demo: evaluación de un evento anterior, con el plazo de edición terminado */
        prueba("Cuartos de final", "calificado", { eventoId: "e3", fecha: "Vie, 06 2026 · 5:10 PM", evaluador: EVALUADOR, alreadyEvaluated: true, editableUntil: "2026-03-18" }),
      ], miembros: miembrosVoleibol }),
    deportista({ id: "c3", nombre: "Selección de Fútbol sala", deporte: "Fútbol sala", categoria: "Prejuvenil", estado: "sinCalificacion", tipo: "Conjunto", colegio: "Colegio Nacional", modalidad: "Microfútbol", sexo: "Hombre",
      pruebas: [prueba("Cuartos de final", "sinCalificacion")], miembros: miembrosFutbolSala }),
  ];

  const deportistas = individuales.concat(conjunto); /* _todosDeportistas: los de cada evento */

  /* EXTRA de la demo: atletas asignados en un evento PROGRAMADO (Dakar). El metodólogo tiene boxeo, lucha y esgrima asignados y debe verlos
     aunque el evento aún no haya empezado (antes la app mostraba 0 atletas mientras el evento estaba «programado»). Lista propia: no se mezcla con la de los otros eventos. */
  const dk = (id, nombre, deporte, sexo, colegio, modalidad, prueba_, evId) => deportista({ id, nombre, deporte, categoria: "Juvenil", estado: "sinCalificacion", colegio, modalidad, clasificacionFuncional: "—", sexo, pruebas: [prueba(prueba_, "sinCalificacion", { eventoId: evId || "e5" })] });
  /* Equipos de Dakar (deportes de conjunto) con sus integrantes; sus pruebas son del evento e5 y quedan bloqueadas al ser un evento programado */
  const mdk = (id, nombre, dep, sexo, colegio) => deportista({ id, nombre, deporte: dep, categoria: "Juvenil", estado: "sinCalificacion", tipo: "Conjunto", colegio, sexo, pruebas: [prueba(dep, "sinCalificacion", { eventoId: "e5" })] });
  const miembrosBaloncesto3x3 = [
    mdk("c4-m1", "Juliana Arango", "Baloncesto", "Mujer", "Colegio Los Nogales"),
    mdk("c4-m2", "Manuela Ortiz", "Baloncesto", "Mujer", "Colegio Los Nogales"),
    mdk("c4-m3", "Antonia Salazar", "Baloncesto", "Mujer", "Colegio Los Nogales"),
    mdk("c4-m4", "Gabriela Fonseca", "Baloncesto", "Mujer", "Colegio Los Nogales"),
  ];
  const miembrosRugby = [
    mdk("c5-m1", "Felipe Alzate", "Rugby", "Hombre", "Colegio Cumbres"),
    mdk("c5-m2", "Sebastián Pinzón", "Rugby", "Hombre", "Colegio Cumbres"),
    mdk("c5-m3", "Alejandro Cortés", "Rugby", "Hombre", "Colegio Cumbres"),
    mdk("c5-m4", "Emilio Duarte", "Rugby", "Hombre", "Colegio Cumbres"),
  ];
  const equiposDakar = [
    deportista({ id: "c4", nombre: "Selección de Baloncesto 3x3", deporte: "Baloncesto", categoria: "Juvenil", estado: "sinCalificacion", tipo: "Conjunto", colegio: "Colegio Los Nogales", modalidad: "3x3", sexo: "Mujer",
      pruebas: [prueba("Fase de grupos", "sinCalificacion", { eventoId: "e5" })], miembros: miembrosBaloncesto3x3 }),
    deportista({ id: "c5", nombre: "Selección de Rugby 7", deporte: "Rugby", categoria: "Juvenil", estado: "sinCalificacion", tipo: "Conjunto", colegio: "Colegio Cumbres", modalidad: "Sevens", sexo: "Hombre",
      pruebas: [prueba("Fase de grupos", "sinCalificacion", { eventoId: "e5" })], miembros: miembrosRugby }),
  ];
  const dakar = [
    dk("d6", "Mateo Cárdenas", "Boxeo", "Hombre", "Colegio Champagnat", "Peso ligero", "Peso ligero 60 kg"),
    dk("d7", "Camila Herrera", "Boxeo", "Mujer", "Liceo Femenino", "Peso pluma", "Peso pluma 54 kg"),
    dk("d8", "Santiago Vélez", "Lucha", "Hombre", "Colegio San Carlos", "Estilo libre", "Estilo libre 65 kg"),
    dk("d9", "Daniela Quintero", "Lucha", "Mujer", "Gimnasio Los Andes", "Estilo libre", "Estilo libre 57 kg"),
    dk("d10", "Nicolás Ospina", "Esgrima", "Hombre", "Colegio Berchmans", "Espada", "Espada individual"),
    dk("d11", "Isabela Mejía", "Esgrima", "Mujer", "Colegio Bolívar", "Florete", "Florete individual"),
  ].concat(equiposDakar);
  /* EXTRA de la demo: atletas propios del Festival deportivo escolar (e2, programado); antes compartía la lista del evento en curso */
  const festival = [
    dk("d12", "Tomás Aguirre", "Atletismo", "Hombre", "Colegio Gimnasio del Norte", "Pista", "400m planos", "e2"),
    dk("d13", "Luciana Pardo", "Natación", "Mujer", "Colegio Anglo Colombiano", "Piscina", "100m libre", "e2"),
    dk("d14", "Esteban Rojas", "Ajedrez", "Hombre", "Colegio San Bartolomé", "Individual", "Partida rápida", "e2"),
    dk("d15", "Valeria Mora", "Gimnasia", "Mujer", "Liceo Campestre", "Artística", "Barras asimétricas", "e2"),
  ];
  /* esEquipo e inicial son getters de DeportistaVm: equipo = targetType TEAM o con integrantes */
  deportistas.concat(dakar, festival, miembrosBaloncesto3x3, miembrosRugby, miembrosBaloncesto, miembrosVoleibol, miembrosFutbolSala).forEach((d) => {
    d.esEquipo = d.targetType.toUpperCase() === "TEAM" || d.miembros.length > 0;
    d.inicial = d.nombre ? d.nombre[0] : "";
  });

  /* EventoVm. e1 y e2 son de coc_sample.dart. e3 es un EXTRA de la demo (no existe en la muestra de la app):
     da un evento "Finalizado" para que el filtro «Estado» y el aviso de plazo de edición tengan caso. editableUntil es fija (AAAA-MM-DD). */
  const eventos = [
    { id: "e1", nombre: "Juegos panamericanos de la juventud 2026", fecha: "9-23 Ago.", lugar: "Ciudad de Panamá", estado: "enCurso", estadoLabel: "En curso", imagen: IMG + "evento1.jpg", deportistas, sportCodes: [], editableUntil: null },
    { id: "e2", nombre: "Festival deportivo escolar 2026", fecha: "12-25 Abr.", lugar: "Bogotá", estado: "programado", estadoLabel: "Programado", imagen: IMG + "evento2.jpg", deportistas: festival, sportCodes: [], editableUntil: null },
    { id: "e3", extra: true, nombre: "XXIII Juegos Deportivos Nacionales", fecha: "3-8 Mar.", lugar: "Córdoba y Sucre", estado: "finalizado", estadoLabel: "Finalizado", imagen: IMG + "evento3.jpg", deportistas, sportCodes: [], editableUntil: "2026-03-18" },
    { id: "e4", extra: true, nombre: "Campeonato Suramericano Juvenil 2026", fecha: "1-9 Ago.", lugar: "Lima", estado: "enCurso", estadoLabel: "En curso", imagen: IMG + "evento2.jpg", deportistas, sportCodes: [], editableUntil: null },
    { id: "e5", extra: true, nombre: "Juegos Olímpicos de la Juventud Dakar 2026", fecha: "31 Oct.-13 Nov.", lugar: "Dakar, Senegal", estado: "programado", estadoLabel: "Programado", imagen: IMG + "evento5.jpg", deportistas: dakar, sportCodes: [], editableUntil: null },
  ];

  /* Evento programado: aún no se puede calificar. La prueba queda bloqueada con motivo («No se puede calificar»), como la app cuando el backend la marca no evaluable. */
  eventos.filter((e) => e.estado === "programado").forEach((e) => e.deportistas.concat(e.deportistas.flatMap((d) => d.miembros)).forEach((d) => d.pruebas.forEach((p) => {
    if ((p.eventoId || "e1") === e.id && !p.blockedReason) { p.blockedReason = "El evento aún no inicia"; p.evaluable = false; }
  })));

  /* Usuario de la sesión de mentira (coc_sample: metodologoNombre / metodologoRol / metodologoEmail) */
  const usuario = { id: 1, name: "Juan José Pérez Granados", rol: "Metodólogo", email: "rusbel.pinto@gmail.com" };

  /* Fecha corta para espacios chicos (avisos): "2026-03-18" → "18 mar. 2026" */
  const MESES_CORTOS = ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sep.", "oct.", "nov.", "dic."];
  const fechaCorta = (iso) => { const [y, m, d] = iso.split("-").map(Number); return d + " " + MESES_CORTOS[m - 1] + " " + y; };
  const MESES_LARGOS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  /* formatFechaLarga (shared/utils/date_format.dart): "18 de marzo de 2026" desde "AAAA-MM-DD" */
  const fechaLarga = (iso) => { const [y, m, d] = iso.split("-").map(Number); return d + " de " + MESES_LARGOS[m - 1] + " de " + y; };

  /* Normaliza para comparar: minúsculas y sin acentos (la búsqueda de la app real es del backend y no distingue acentos) */
  const norm = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  window.Data = {
    STATUS_LABEL, eventos, deportistas, individuales, conjunto, usuario, fechaLarga, fechaCorta, norm,
    evento: (id) => eventos.find((e) => e.id === id) || null,
    deportista: (id) => { const all = deportistas.concat(deportistas.flatMap((d) => d.miembros)); return all.find((d) => d.id === id) || null; },
    /* Portada por defecto cuando un evento no trae imagen (DesignSystem.images.eventoGenerico) */
    eventoGenerico: IMG + "olimpicos.png",
  };
})();
