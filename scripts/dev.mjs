/* Servidor estático en :8770. Si app.json trae "proxy", /mobile/apps/<id>/* va a ese dev server (mismo origen). */
import { createServer, request } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname, dirname, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { registrar } from "./registrar.mjs";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = +process.env.PORT || 8770;
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2", ".woff": "font/woff", ".ico": "image/x-icon" };

const proxies = () => Object.fromEntries(registrar().filter((a) => a.proxy).map((a) => [a.id, a.proxy]));

createServer((req, res) => {
  const url = new URL(req.url, "http://x"), m = /^\/mobile\/apps\/([^/]+)\//.exec(url.pathname), px = m && proxies()[m[1]];
  if (px) {
    const t = new URL(px);
    const up = request({ hostname: t.hostname, port: t.port, path: req.url, method: req.method, headers: { ...req.headers, host: t.host } }, (r) => { res.writeHead(r.statusCode, r.headers); r.pipe(res); });
    up.on("error", () => { res.writeHead(502); res.end("No responde el dev server de la app en " + px); });
    return req.pipe(up);
  }
  let f = normalize(join(raiz, decodeURIComponent(url.pathname)));
  if (!f.startsWith(raiz)) { res.writeHead(403); return res.end(); }
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.writeHead(404); return res.end("404"); }
  res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream", "cache-control": "no-store" });
  res.end(readFileSync(f));
}).listen(PORT, () => console.log("Demos en http://localhost:" + PORT + "/  (móvil con ?dev=1 para el modo dev)"));
