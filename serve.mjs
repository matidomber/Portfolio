// Lokalny podgląd site/ zachowujący się jak Cloudflare Pages: Brotli, poprawne typy MIME, nagłówki z site/_headers,
// 404 z site/404.html. Użycie: node serve.mjs [port=8081]
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';
import { brotliCompressSync, gzipSync, constants } from 'node:zlib';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), 'site');
const PORT = Number(process.argv[2] || 8081);
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json' };
const TEXT = new Set(['.html', '.css', '.js', '.svg', '.xml', '.txt', '.json']);

// Nagłówki z _headers (ten sam format co Cloudflare Pages).
const rules = [];
if (existsSync(join(ROOT, '_headers'))) {
  let cur = null;
  for (const line of readFileSync(join(ROOT, '_headers'), 'utf8').split('\n')) {
    if (!line.trim()) continue;
    if (!line.startsWith(' ')) { cur = { pattern: line.trim(), headers: {} }; rules.push(cur); }
    else if (cur) { const i = line.indexOf(':'); cur.headers[line.slice(0, i).trim()] = line.slice(i + 1).trim(); }
  }
}
const matches = (pattern, path) => pattern.endsWith('*') ? path.startsWith(pattern.slice(0, -1)) : pattern === path;
const cache = new Map();

createServer((req, res) => {
  let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (path.endsWith('/')) path += 'index.html';
  let file = normalize(join(ROOT, path));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  let status = 200;
  if (!existsSync(file) || statSync(file).isDirectory()) {
    if (existsSync(file) && existsSync(join(file, 'index.html'))) { res.writeHead(301, { Location: path + '/' }); return res.end(); }
    file = join(ROOT, '404.html'); status = 404;
  }
  const ext = extname(file).toLowerCase();
  const headers = { 'Content-Type': MIME[ext] || 'application/octet-stream', Vary: 'Accept-Encoding' };
  for (const r of rules) if (matches(r.pattern, path)) Object.assign(headers, r.headers);
  let body = readFileSync(file);
  const ae = req.headers['accept-encoding'] || '';
  if (TEXT.has(ext) && body.length > 500) {
    const key = file + ':' + statSync(file).mtimeMs;
    if (/\bbr\b/.test(ae)) {
      if (!cache.has(key)) cache.set(key, brotliCompressSync(body, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } }));
      body = cache.get(key); headers['Content-Encoding'] = 'br';
    } else if (/\bgzip\b/.test(ae)) { body = gzipSync(body, { level: 9 }); headers['Content-Encoding'] = 'gzip'; }
  }
  headers['Content-Length'] = body.length;
  res.writeHead(status, headers);
  res.end(body);
}).listen(PORT, '127.0.0.1', () => console.log(`site/ na http://127.0.0.1:${PORT}/ (Brotli, nagłówki z _headers)`));
