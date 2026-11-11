/* Datos de deportistas ampliados (complementa data.js; mismo origen: lib/shared/sample/coc_sample.dart).
   data.js ya porta _deportistas, _deportistasConjunto, los integrantes, los eventos y el usuario. Este archivo:
   - completa los campos de DeportistaVm/PruebaVm que data.js omite (eventCode, organizationCode, participantCode,
     disciplineCode, liteDisciplineCode con sus defaults del Dart);
   - expone los helpers/contratos para las pantallas de evento, deportista, evaluación y perfil.
   NO se inventan datos: coc_sample.dart no trae evaluaciones de ejemplo ni catálogos; las listas de filtros se derivan
   de los datos fijos (mismas opciones que OcDeportistaFilterSheet) y la opinión de solo lectura la arma cada pantalla
   con los campos de la PruebaVm (fecha, evaluador) igual que la app cuando no hay respuesta del backend.

   Contrato (window.Data):
     Data.eventos[i].deportistas        DeportistaVm[] (individuales + conjunto, mismos objetos en e1/e2/e3)
     Data.deportistaById(id)            DeportistaVm | null (incluye integrantes: c1-m1 ...)
     Data.eventoDeDeportista(id)        EventoVm | null (primer evento que lo contiene; todos comparten la lista)
     Data.metodologo                    { nombre, rol, email }   (metodologoNombre / metodologoRol / metodologoEmail)
     Data.filtros                       { estados:[{label,value}], generos:[...], todosLosDeportes }
     Data.deportesDelEvento(evento)     nombres de deporte distintos (orden de aparición) = "Deportes a calificar"
     Data.deportesOrdenados(evento)     lo mismo, ordenado A-Z (dropdown del filtro)
     Data.deporteIcono(nombre)          nombre de icono (ICONS) del deporte (deporteIconoAsset)
     Data.categorias / Data.deportes    catálogos derivados de los datos fijos
   Estados de calificación: "calificado" | "sinCalificacion" (OcStatus). */
(() => {
  "use strict";
  const D = window.Data;

  /* Defaults de PruebaVm / DeportistaVm que data.js no rellena */
  /* Todos los deportistas conocidos: la lista común y las propias de cada evento (p. ej. Dakar), con sus integrantes */
  const base = [...new Set(D.deportistas.concat(D.eventos.flatMap((e) => e.deportistas)))];
  const all = base.concat(base.flatMap((d) => d.miembros));
  all.forEach((d) => {
    ["eventCode", "organizationCode"].forEach((k) => { if (d[k] == null) d[k] = ""; });
    d.pruebas.forEach((p) => ["participantCode", "disciplineCode", "liteDisciplineCode"].forEach((k) => { if (p[k] == null) p[k] = ""; }));
  });

  const unicos = (xs) => xs.filter((x, i) => x && xs.indexOf(x) === i);
  const sinAcentos = (s) => D.norm(s);

  /* deporte_iconos.dart::deporteIconoAsset (más específicos primero) */
  const ICONOS = [
    ["subacuatica", "actividades-sub-acuaticas"], ["natacion", "natacion"], ["acuatico", "natacion"], ["atletismo", "atletismo"],
    ["ciclismo", "ciclismo"], ["gimnasia", "gimnasia"], ["tenis de mesa", "tenis-de-mesa"], ["tenis", "tenis"],
    ["baloncesto", "baloncesto"], ["voleibol", "voleibol"], ["futbol sala", "futbol-sala"], ["futsal", "futbol-sala"],
    ["futbol", "futbol"], ["balonmano", "balon-mano"], ["balon mano", "balon-mano"], ["boccia", "Boccia"], ["badminton", "badminton"],
    ["boxeo", "boxeo"], ["judo", "judo"], ["karate", "karate"], ["taekwondo", "taekwondo"], ["lucha", "lucha"], ["esgrima", "esgrima"],
    ["patinaje", "patinaje"], ["tejo", "tejo"], ["triatlon", "triatlon"], ["rugby", "rugby"], ["beisbol", "beisbol"], ["softbol", "softbol"],
    ["ajedrez", "ajedrez"], ["pesas", "levantamiento-de-pesas"], ["levantamiento", "levantamiento-de-pesas"],
  ];
  const deporteIcono = (nombre) => { const d = sinAcentos(nombre || ""); const hit = ICONOS.find((p) => d.includes(p[0])); return hit ? hit[1] : "trofeo"; };

  /* Deportes a calificar: sportCodes vacío => evento completo => nombres distintos de los candidatos (orden de aparición) */
  const deportesDelEvento = (ev) => unicos((ev && ev.deportistas ? ev.deportistas : D.deportistas).map((d) => d.deporte));
  const deportesOrdenados = (ev) => deportesDelEvento(ev).slice().sort((a, b) => a.localeCompare(b, "es"));

  D.metodologo = { nombre: D.usuario.name, rol: D.usuario.rol, email: D.usuario.email };
  /* DeportistaFiltro: estados Sin calificación / Calificado; géneros Hombre / Mujer */
  D.filtros = {
    todosLosDeportes: "Todos los deportes",
    estados: [{ label: "Sin calificación", value: "sinCalificacion" }, { label: "Calificado", value: "calificado" }],
    generos: ["Hombre", "Mujer"],
  };
  D.deportes = deportesOrdenados(null);
  D.categorias = unicos(D.deportistas.map((d) => d.categoria));
  D.deportistaById = (id) => all.find((d) => d.id === id) || null;
  /* Equipo al que pertenece un integrante (los equipos viven en la lista de cada evento) */
  D.equipoDeMiembro = (id) => base.find((t) => t.miembros.some((m) => m.id === id)) || null;
  D.eventoDeDeportista = (id) => D.eventos.find((e) => e.deportistas.some((d) => d.id === id || d.miembros.some((m) => m.id === id))) || null;
  D.deportesDelEvento = deportesDelEvento;
  D.deportesOrdenados = deportesOrdenados;
  D.deporteIcono = deporteIcono;
})();
