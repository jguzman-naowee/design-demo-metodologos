/* Uso: npm run nueva-app -- <id> [--desde <carpeta-build>] [--nombre "Texto"] */
import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { registrar } from "./registrar.mjs";

const a = process.argv.slice(2), val = (f) => (a.includes(f) ? a[a.indexOf(f) + 1] : null);
const id = a[0] && !a[0].startsWith("--") ? a[0] : null;
if (!id || !/^[a-z0-9-]+$/.test(id)) { console.error('Uso: npm run nueva-app -- <id-en-kebab> [--desde <build>] [--nombre "Texto"]'); process.exit(1); }

const dest = join(dirname(fileURLToPath(import.meta.url)), "..", "mobile", "apps", id);
if (existsSync(dest)) { console.error("Ya existe mobile/apps/" + id); process.exit(1); }
mkdirSync(dest, { recursive: true });

const desde = val("--desde");
if (desde) {
  const src = resolve(desde);
  if (!existsSync(join(src, "index.html"))) { console.error("No hay index.html en " + src + ": ¿es la carpeta del build?"); process.exit(1); }
  cpSync(src, dest, { recursive: true });
} else {
  writeFileSync(join(dest, "index.html"), '<!doctype html>\n<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + id + "</title></head>\n<body><h1>" + id + "</h1></body></html>\n");
}
writeFileSync(join(dest, "app.json"), JSON.stringify({ nombre: val("--nombre") || id, inicio: "index.html" }, null, 2) + "\n");
writeFileSync(join(dest, "casos.js"), '/* Pasos: goto (sin url va a «inicio»), click (sel), note (sel opcional). Con ?dev=1 el botón «Elegir elemento» te da el selector. */\nwindow.CASOS = [\n  { id: "1.1", titulo: "Primer caso", falta: "",\n    steps: [\n      { t: "goto", body: "Empezamos en el inicio." }\n    ] }\n];\n');
registrar();
console.log("Listo: mobile/apps/" + id + "\nAbrir: http://localhost:8770/mobile/?app=" + id + "&dev=1");
