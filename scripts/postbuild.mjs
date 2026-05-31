/**
 * Generates a static index.html by calling the SSR handler at build time.
 * Runs after `vite build` via the `build:netlify` npm script.
 */
import { writeFileSync, readdirSync, statSync } from "fs";
import { pathToFileURL } from "url";
import { resolve } from "path";

const serverPath = resolve("dist/server/server.js");

let html;

try {
  // Try SSR render via the built server handler (Node 18+ has Web API)
  const { default: handler } = await import(pathToFileURL(serverPath).href);
  const req = new Request("http://localhost/");
  const res = await handler.fetch(req, {}, {});
  html = await res.text();
  console.log("✓ SSR render succeeded");
} catch (e) {
  // Fallback: generate a minimal SPA shell if SSR fails
  console.warn("SSR render failed, using SPA shell fallback:", e.message);

  const assets = readdirSync("dist/client/assets");
  const css = assets.find((f) => f.endsWith(".css")) ?? "";
  const jsFiles = assets
    .filter((f) => f.endsWith(".js") && f.startsWith("index-"))
    .sort(
      (a, b) =>
        statSync(`dist/client/assets/${b}`).size -
        statSync(`dist/client/assets/${a}`).size
    );
  const mainJs = jsFiles[0] ?? "";

  html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Haquímia — Joias artesanais em ouro</title>
  <meta name="description" content="Haquímia — joias artesanais brasileiras em prata 925 com banho de ouro. Peças personalizadas criadas a partir de uma conversa."/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400&display=swap"/>
  ${css ? `<link rel="stylesheet" href="/assets/${css}"/>` : ""}
</head>
<body>
  ${mainJs ? `<script type="module" src="/assets/${mainJs}"></script>` : ""}
</body>
</html>`;
}

writeFileSync("dist/client/index.html", html);
console.log("✓ dist/client/index.html written");
