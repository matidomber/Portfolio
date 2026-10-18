// Lokalny podgląd site/ zachowujący się jak Cloudflare: Brotli, poprawne typy MIME, nagłówki z site/_headers
// (z łączeniem wartości przecinkiem i odłączaniem „! Nagłówek”, jak u Cloudflare), 404 z site/404.html.
// Ostateczny test zachowania Cloudflare: npx wrangler dev. Użycie: node serve.mjs [port=8081]
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';
import { brotliCompressSync, gzipSync, constants } from 'node:zlib';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), 'site');
const PORT = Number(process.argv[2] || 8081);
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json', '.vcf': 'text/vcard; charset=utf-8' };
const TEXT = new Set(['.html', '.css', '.js', '.svg', '.xml', '.txt', '.json', '.vcf']);

// Reguły z _headers: { pattern, set: {nazwa: wartość}, detach: [nazwy] }.
const rules = [];
if (existsSync(join(ROOT, '_headers'))) {
  let cur = null;
  for (const line of readFileSync(join(ROOT, '_headers'), 'utf8').split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    if (!/^\s/.test(line)) { cur = { pattern: line.trim(), set: {}, detach: [] }; rules.push(cur); continue; }
    if (!cur) continue;
    const t = line.trim();
    if (t.startsWith('!')) { cur.detach.push(t.slice(1).trim().toLowerCase()); continue; }
    const i = t.indexOf(':');
    cur.set[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
}
const matches = (pattern, path) => (pattern.endsWith('*') ? path.startsWith(pattern.slice(0, -1)) : pattern === path);
function customHeaders(path) {
  const out = new Map();
  for (const r of rules) if (matches(r.pattern, path)) {
    for (const [k, v] of Object.entries(r.set)) {
      const key = k.toLowerCase();
      out.set(key, out.has(key) ? { name: out.get(key).name, value: out.get(key).value + ', ' + v } : { name: k, value: v });
    }
  }
  for (const r of rules) if (matches(r.pattern, path)) for (const d of r.detach) out.delete(d);
  return out;
}
const cache = new Map();

createServer((req, res) => {
  const reqPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (reqPath === '/_headers' || reqPath === '/_redirects') { res.writeHead(404); return res.end(); }
  let path = reqPath.endsWith('/') ? reqPath + 'index.html' : reqPath;
  let file = normalize(join(ROOT, path));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  let status = 200;
  if (!existsSync(file) || statSync(file).isDirectory()) {
    if (existsSync(join(file, 'index.html'))) { res.writeHead(307, { Location: reqPath + '/' }); return res.end(); }
    file = join(ROOT, '404.html'); status = 404;
  }
  const ext = extname(file).toLowerCase();
  const headers = { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': 'public, max-age=0, must-revalidate', Vary: 'Accept-Encoding' };
  for (const { name, value } of customHeaders(reqPath).values()) {
    for (const k of Object.keys(headers)) if (k.toLowerCase() === name.toLowerCase()) delete headers[k];
    headers[name] = value;
  }
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
