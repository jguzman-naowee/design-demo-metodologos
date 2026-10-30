/* Regenera mobile/apps/index.js con las carpetas que tienen app.json. */
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..", "mobile", "apps");
export function registrar() {
  const apps = readdirSync(raiz, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(raiz, d.name, "app.json")))
    .map((d) => ({ id: d.name, ...JSON.parse(readFileSync(join(raiz, d.name, "app.json"), "utf8")) }));
  writeFileSync(join(raiz, "index.js"), "/* Generado por scripts/registrar.mjs: no editar a mano. */\nwindow.APPS = " + JSON.stringify(apps, null, 2) + ";\n");
  return apps;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(registrar().map((a) => a.id).join(", "));
