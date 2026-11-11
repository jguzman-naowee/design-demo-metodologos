/* xlsx.js — genera un .xlsx real en el navegador, sin dependencias (window.Xlsx). La demo es estática: no hay servicio que arme el archivo.
   Un .xlsx es un ZIP de XML; aquí se escribe el ZIP «sin comprimir» (método 0), que Excel, Numbers y Google Sheets abren sin problema.

   API
     Xlsx.blob({ hoja, columnas: [ancho...], filas: [[celda...]...] })   Blob
     Xlsx.descargar(nombreArchivo, opciones)                              dispara la descarga
   Celda: valor (texto o número) | { v, s }  con s = estilo: "titulo" | "negrita" | "encabezado" | "texto" (ajuste de línea, arriba). */
(() => {
  "use strict";

  const ESTILOS = { normal: 0, titulo: 1, negrita: 2, encabezado: 3, texto: 4 };
  const enc = new TextEncoder();

  /* ── CRC32 ── */
  const TABLA = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  const crc32 = (u8) => { let c = 0xFFFFFFFF; for (let i = 0; i < u8.length; i++) c = TABLA[(c ^ u8[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };

  /* ── ZIP sin comprimir ── */
  function zip(archivos) {
    const partes = [], central = [];
    let pos = 0;
    const u16 = (n) => [n & 255, (n >>> 8) & 255], u32 = (n) => [n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255];
    const FECHA = 0x5A21, HORA = 0; /* 2025-01-01 00:00 en formato DOS: fija, para que el archivo sea reproducible */
    archivos.forEach((a) => {
      const nombre = enc.encode(a.nombre), datos = enc.encode(a.contenido), crc = crc32(datos);
      const local = Uint8Array.from([0x50, 0x4B, 3, 4, ...u16(20), ...u16(0x0800), ...u16(0), ...u16(HORA), ...u16(FECHA), ...u32(crc), ...u32(datos.length), ...u32(datos.length), ...u16(nombre.length), ...u16(0)]);
      partes.push(local, nombre, datos);
      central.push(Uint8Array.from([0x50, 0x4B, 1, 2, ...u16(20), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(HORA), ...u16(FECHA), ...u32(crc), ...u32(datos.length), ...u32(datos.length), ...u16(nombre.length), ...u16(0), ...u16(0), ...u16(0), ...u16(0), ...u32(0), ...u32(pos)]), nombre);
      pos += local.length + nombre.length + datos.length;
    });
    const tamCentral = central.reduce((s, p) => s + p.length, 0);
    const fin = Uint8Array.from([0x50, 0x4B, 5, 6, ...u16(0), ...u16(0), ...u16(archivos.length), ...u16(archivos.length), ...u32(tamCentral), ...u32(pos), ...u16(0)]);
    return new Blob([...partes, ...central, fin], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  }

  /* ── XML ── */
  const esc = (t) => String(t).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const col = (n) => { let s = ""; for (n++; n > 0; n = Math.floor((n - 1) / 26)) s = String.fromCharCode(65 + ((n - 1) % 26)) + s; return s; };
  const CAB = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';

  function hoja(filas, anchos) {
    const cols = anchos && anchos.length ? "<cols>" + anchos.map((w, i) => '<col min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + w + '" customWidth="1"/>').join("") + "</cols>" : "";
    const rows = filas.map((fila, r) => {
      const celdas = fila.map((c, i) => {
        if (c === null || c === undefined || c === "") return "";
        const o = typeof c === "object" ? c : { v: c };
        const s = ESTILOS[o.s || "normal"] || 0, ref = col(i) + (r + 1);
        return typeof o.v === "number"
          ? '<c r="' + ref + '" s="' + s + '"><v>' + o.v + "</v></c>"
          : '<c r="' + ref + '" s="' + s + '" t="inlineStr"><is><t xml:space="preserve">' + esc(o.v) + "</t></is></c>";
      }).join("");
      return '<row r="' + (r + 1) + '">' + celdas + "</row>";
    }).join("");
    return CAB + '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' + cols + "<sheetData>" + rows + "</sheetData></worksheet>";
  }

  /* 0 normal · 1 título · 2 negrita · 3 encabezado (negrita, fondo gris, borde inferior) · 4 texto largo (ajuste de línea, arriba) */
  const ESTILOS_XML = CAB + '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
    '<fonts count="3"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="15"/><name val="Calibri"/></font></fonts>' +
    '<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFE7E9F3"/><bgColor indexed="64"/></patternFill></fill></fills>' +
    '<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left/><right/><top/><bottom style="thin"><color rgb="FF9C9EBF"/></bottom><diagonal/></border></borders>' +
    '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
    '<cellXfs count="5">' +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
    '<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/>' +
    '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>' +
    '<xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>' +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>' +
    '</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';

  function blob(o) {
    const nombreHoja = esc(String(o.hoja || "Hoja1").replace(/[\\/?*[\]:]/g, " ").slice(0, 31));
    return zip([
      { nombre: "[Content_Types].xml", contenido: CAB + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>' },
      { nombre: "_rels/.rels", contenido: CAB + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>' },
      { nombre: "xl/workbook.xml", contenido: CAB + '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="' + nombreHoja + '" sheetId="1" r:id="rId1"/></sheets></workbook>' },
      { nombre: "xl/_rels/workbook.xml.rels", contenido: CAB + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>' },
      { nombre: "xl/styles.xml", contenido: ESTILOS_XML },
      { nombre: "xl/worksheets/sheet1.xml", contenido: hoja(o.filas || [], o.columnas) },
    ]);
  }

  function descargar(nombre, o) {
    const url = URL.createObjectURL(blob(o));
    const a = document.createElement("a");
    a.href = url; a.download = nombre; a.style.display = "none";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  window.Xlsx = { blob, descargar };
})();
