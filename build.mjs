// Build strony mateuszdombrowski.com: src/ -> site/.
// Bez frameworka. Składa strony z fragmentów (src/partials), robi twardą typografię polską,
// generuje AVIF/WebP/JPG w kilku szerokościach, minifikuje CSS/JS/HTML, nadaje plikom nazwy z hashem,
// liczy hash skryptu inline do CSP i pisze nagłówki dla Cloudflare Pages (_headers).
// Użycie: node build.mjs [--watch]
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, readdirSync, statSync, copyFileSync, watch } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, basename, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { transform } from 'esbuild';
import { minify as minifyHtml } from 'html-minifier-terser';
import QRCode from 'qrcode';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, 'src');
const OUT = join(ROOT, 'site');
const SITE_URL = 'https://mateuszdombrowski.com';
const NBSP = ' ';
const hash = (buf) => createHash('sha256').update(buf).digest('hex').slice(0, 8);
const read = (p) => readFileSync(p, 'utf8');
const write = (p, data) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, data); };
const today = () => new Date().toISOString().slice(0, 10);

// ---------------------------------------------------------------- szablony (minimalne mustache)
function render(tpl, vars, depth = 0) {
  if (depth > 20) throw new Error('Za głębokie zagnieżdżenie fragmentów');
  // sekcje {{#k}}...{{/k}} i odwrotne {{^k}}...{{/k}}
  tpl = tpl.replace(/\{\{([#^])([\w-]+)\}\}([\s\S]*?)\{\{\/\2\}\}/g, (m, kind, key, body) => {
    const v = vars[key];
    const on = Array.isArray(v) ? v.length > 0 : !!v;
    return (kind === '#') === on ? body : '';
  });
  // fragmenty {{> nazwa}}
  tpl = tpl.replace(/\{\{>\s*([\w./-]+)\s*\}\}/g, (m, name) => render(read(join(SRC, 'partials', name + '.html')), vars, depth + 1));
  // zmienne {{k}}
  tpl = tpl.replace(/\{\{([\w-]+)\}\}/g, (m, key) => (key in vars ? String(vars[key]) : m));
  return tpl;
}

// ---------------------------------------------------------------- typografia PL (tylko w tekście, nie w znacznikach, skryptach i <pre>)
function typografia(html) {
  const parts = html.split(/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<pre[\s\S]*?<\/pre>|<[^>]+>)/);
  for (let k = 0; k < parts.length; k++) {
    let c = parts[k];
    if (!c || c.startsWith('<')) continue;
    for (let i = 0; i < 2; i++) c = c.replace(new RegExp('(^|[\\s(„' + NBSP + '])([aiouwzAIOUWZ]) ', 'g'), (m, a, b) => a + b + NBSP);
    c = c.replace(/(\d) (?=\d{3}\b)/g, '$1' + NBSP);
    c = c.replace(/(\d) (?=(zł|h|godzin|godziny|godzinę|dni|dzień|minut|ofert|pliki|plików|produkt|produkty|produktów|przesyłki|tydzień|tygodnie|rekordów|px|KB|s)\b)/g, '$1' + NBSP);
    parts[k] = c;
  }
  return parts.join('');
}

// ---------------------------------------------------------------- fonty: kopiowanie z hashem i @font-face z metadanych Google (zakresy osi i unicode-range)
function buildFonts() {
  const css = read(join(SRC, 'fonts', 'google.css'));
  const faces = [];
  const re = /\/\* (\w[\w-]*) \*\/\s*@font-face \{([\s\S]*?)\}/g;
  let m;
  while ((m = re.exec(css))) {
    const [, subset, body] = m;
    if (subset !== 'latin' && subset !== 'latin-ext') continue;
    const fam = body.match(/font-family: '([^']+)'/)[1];
    const weight = body.match(/font-weight: ([^;]+)/)[1];
    const stretch = (body.match(/font-stretch: ([^;]+)/) || [])[1];
    const range = body.match(/unicode-range: ([^;]+)/)[1];
    const slug = fam.toLowerCase().replace(/ /g, '-') + '-' + subset;
    const src = join(SRC, 'fonts', slug + '.woff2');
    const buf = readFileSync(src);
    const outName = slug + '.' + hash(buf) + '.woff2';
    write(join(OUT, 'assets', 'fonts', outName), buf);
    // Kod kreskowy nie może pokazać tekstu zastępczego (ciąg sterujący Code 128 wyglądałby jak śmieci): block.
    const display = fam === 'Libre Barcode 128' ? 'block' : 'swap';
    faces.push(`@font-face{font-family:"${fam}";font-style:normal;font-weight:${weight};${stretch ? `font-stretch:${stretch};` : ''}font-display:${display};src:url(/assets/fonts/${outName}) format("woff2");unicode-range:${range}}`);
  }
  // Preload: Mona Sans (nagłówek i treść) w obu podzbiorach; reszta dociąga się przez CSS.
  const preload = faces.filter((f) => f.includes('"Mona Sans"')).map((f) => f.match(/url\(([^)]+)\)/)[1]);
  return { css: faces.join('\n'), preload };
}

// ---------------------------------------------------------------- obrazy: AVIF/WebP/JPG w kilku szerokościach
const WIDTHS = [480, 800, 1200, 1600];
async function buildImages() {
  const manifest = {};
  const dir = join(SRC, 'img');
  mkdirSync(join(OUT, 'assets', 'img'), { recursive: true });
  for (const f of readdirSync(dir)) {
    const ext = extname(f).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;
    const name = basename(f, ext);
    const buf = readFileSync(join(dir, f));
    const h = hash(buf);
    const meta = await sharp(buf).metadata();
    if (name === 'og') {
      // Obraz do podglądów w komunikatorach: stały adres, JPG.
      await sharp(buf).jpeg({ quality: 84, mozjpeg: true }).toFile(join(OUT, 'assets', 'img', 'og.jpg'));
      continue;
    }
    const widths = WIDTHS.filter((w) => w < meta.width);
    widths.push(meta.width);
    const entry = { w: meta.width, h: meta.height, widths, hash: h, formats: { avif: [], webp: [], jpg: [] } };
    for (const w of widths) {
      const base = `/assets/img/${name}.${h}-${w}`;
      const pipe = () => sharp(buf).resize({ width: w, withoutEnlargement: true });
      await pipe().avif({ quality: 56, effort: 6 }).toFile(join(OUT, base + '.avif'));
      await pipe().webp({ quality: 78, effort: 5 }).toFile(join(OUT, base + '.webp'));
      await pipe().jpeg({ quality: 80, mozjpeg: true, progressive: true }).toFile(join(OUT, base + '.jpg'));
      entry.formats.avif.push(`${base}.avif ${w}w`);
      entry.formats.webp.push(`${base}.webp ${w}w`);
      entry.formats.jpg.push(`${base}.jpg ${w}w`);
    }
    entry.fallback = `/assets/img/${name}.${h}-${widths[widths.length - 1]}.jpg`;
    manifest[name] = entry;
  }
  return manifest;
}

// <img src="/img/x.jpg" data-sizes="..." ...> -> <picture> z AVIF/WebP/JPG i srcset. Atrybuty img zostają (alt, width, height, loading, class...).
function pictures(html, manifest) {
  return html.replace(/<img\b([^>]*?)\ssrc="\/img\/([\w-]+)\.(?:jpg|jpeg|png)"([^>]*?)>/g, (m, before, name, after) => {
    const e = manifest[name];
    if (!e) throw new Error('Brak obrazu w src/img: ' + name);
    let attrs = (before + ' ' + after).replace(/\s+/g, ' ').trim();
    const sizesM = attrs.match(/\sdata-sizes="([^"]*)"|^data-sizes="([^"]*)"/);
    const sizes = sizesM ? (sizesM[1] || sizesM[2]) : '100vw';
    attrs = attrs.replace(/\s?data-sizes="[^"]*"/, '');
    // width/height z pliku, żeby nie było przesunięć układu.
    attrs = attrs.replace(/\swidth="\d+"/, '').replace(/\sheight="\d+"/, '');
    const single = e.widths.length === 1;
    const srcset = (arr) => (single ? arr[0].replace(/ \d+w$/, '') : arr.join(', '));
    const sizesAttr = single ? '' : ` sizes="${sizes}"`;
    return `<picture><source type="image/avif" srcset="${srcset(e.formats.avif)}"${sizesAttr}><source type="image/webp" srcset="${srcset(e.formats.webp)}"${sizesAttr}><img src="${e.fallback}"${single ? '' : ` srcset="${srcset(e.formats.jpg)}"${sizesAttr}`} width="${e.w}" height="${e.h}" ${attrs}></picture>`;
  });
}

// ---------------------------------------------------------------- CSS i JS
async function buildCss(fontCss) {
  let css = fontCss + '\n' + read(join(SRC, 'css', 'styles.css'));
  const out = (await transform(css, { loader: 'css', minify: true, target: ['chrome100', 'safari15', 'firefox100'] })).code;
  const name = `styles.${hash(out)}.css`;
  write(join(OUT, 'assets', 'css', name), out);
  return '/assets/css/' + name;
}
async function buildJs() {
  const vendorDir = join(SRC, 'js', 'vendor');
  const bundle = (files, name) => {
    const code = files.map((f) => read(join(vendorDir, f)).trim()).join('\n;\n');
    const file = `${name}.${hash(code)}.js`;
    write(join(OUT, 'assets', 'js', file), code);
    return '/assets/js/' + file;
  };
  const vendor = bundle(['gsap.min.js', 'ScrollTrigger.min.js', 'lenis.min.js'], 'vendor');
  const drag = bundle(['Draggable.min.js', 'InertiaPlugin.min.js'], 'vendor-drag');
  const app = (await transform(read(join(SRC, 'js', 'app.js')), { loader: 'js', minify: true, target: ['chrome100', 'safari15', 'firefox100'] })).code;
  const appName = `app.${hash(app)}.js`;
  write(join(OUT, 'assets', 'js', appName), app);
  return { vendor, drag, app: '/assets/js/' + appName };
}

// ---------------------------------------------------------------- strony
function pageVars(src) {
  const m = src.match(/^<!--@page\s*([\s\S]*?)-->\s*/);
  if (!m) throw new Error('Strona bez nagłówka <!--@page {...} -->');
  return { vars: JSON.parse(m[1]), body: src.slice(m[0].length) };
}
// Wizytówka: plik .vcf do pobrania i kod QR z tą samą treścią (telefon po zeskanowaniu proponuje zapis kontaktu).
const VCARD = ['BEGIN:VCARD', 'VERSION:3.0', 'N:Dombrowski;Mateusz;;;', 'FN:Mateusz Dombrowski', 'TITLE:Programista: strony, aplikacje, automatyzacje sklepów', 'EMAIL;TYPE=INTERNET:kontakt@mateuszdombrowski.com', 'URL:https://mateuszdombrowski.com/', 'END:VCARD'].join('\r\n') + '\r\n';
async function buildVcard() {
  write(join(OUT, 'mateusz-dombrowski.vcf'), VCARD);
  const svg = await QRCode.toString(VCARD, { type: 'svg', errorCorrectionLevel: 'M', margin: 0, color: { dark: '#16130f', light: '#0000' } });
  return svg.replace(/<\?xml[^>]*>/, '').replace(/\s+/g, ' ').trim();
}
async function buildPages(assets, manifest) {
  const inlineHashes = new Set();
  const pagesDir = join(SRC, 'pages');
  const urls = [];
  for (const f of readdirSync(pagesDir)) {
    if (!f.endsWith('.html')) continue;
    const { vars, body } = pageVars(read(join(pagesDir, f)));
    const v = { ...assets, siteUrl: SITE_URL, year: new Date().getFullYear(), buildDate: today(), ...vars };
    v.canonical = SITE_URL + v.path;
    let html = render(body, v);
    html = pictures(html, manifest);
    html = typografia(html);
    html = await minifyHtml(html, {
      collapseWhitespace: true, conservativeCollapse: true, removeComments: true, keepClosingSlash: true,
      minifyCSS: true, minifyJS: false, sortAttributes: false, sortClassName: false, decodeEntities: false,
    });
    // Hash skryptów inline do CSP (po minifikacji, bo liczy się dokładna treść).
    for (const s of html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/g)) {
      inlineHashes.add("'sha256-" + createHash('sha256').update(s[1]).digest('base64') + "'");
    }
    const outPath = v.path === '/404' ? join(OUT, '404.html') : join(OUT, v.path.replace(/^\//, ''), 'index.html');
    write(outPath, html);
    if (!v.noindex) urls.push(v.path);
    console.log('  ', outPath.replace(OUT, 'site'), (html.length / 1024).toFixed(1) + ' KB');
  }
  return { inlineHashes: [...inlineHashes], urls };
}

// ---------------------------------------------------------------- pliki statyczne, sitemap, nagłówki Cloudflare
// GSAP (Draggable, ScrollTrigger) ustawia dwa stałe atrybuty style przez setAttribute: CSP dopuszcza je po hashu
// ('unsafe-hashes'), a nie przez 'unsafe-inline'. Hashe liczone z plików vendor, więc po aktualizacji bibliotek
// dalej się zgadzają.
function vendorStyleHashes() {
  const out = new Set();
  for (const f of readdirSync(join(SRC, 'js', 'vendor'))) {
    for (const m of read(join(SRC, 'js', 'vendor', f)).matchAll(/setAttribute\("style","([^"]*)"\)/g)) out.add("'sha256-" + createHash('sha256').update(m[1]).digest('base64') + "'");
  }
  return [...out];
}
function csp(inlineHashes) {
  return [
    "default-src 'self'",
    `script-src 'self' ${inlineHashes.join(' ')}`,
    `style-src 'self' 'unsafe-hashes' ${vendorStyleHashes().join(' ')}`,
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self' https://api.web3forms.com",
    "form-action 'self' https://api.web3forms.com",
    "base-uri 'none'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    'upgrade-insecure-requests',
  ].join('; ');
}
async function buildStatic(inlineHashes, urls) {
  for (const f of ['favicon.svg', 'robots.txt', 'CNAME', 'google25cec84b609ddea3.html']) copyFileSync(join(SRC, f), join(OUT, f));
  // Ikona dla iOS i Androida z tego samego SVG.
  const svg = readFileSync(join(SRC, 'favicon.svg'));
  await sharp(svg, { density: 384 }).resize(180, 180).png().toFile(join(OUT, 'apple-touch-icon.png'));
  await sharp(svg, { density: 384 }).resize(512, 512).png().toFile(join(OUT, 'icon-512.png'));
  write(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.sort().map((u) => `  <url><loc>${SITE_URL}${u}</loc><lastmod>${today()}</lastmod></url>`).join('\n')}\n</urlset>\n`);
  const policy = csp(inlineHashes);
  write(join(OUT, '_headers'), [
    '/*',
    `  Content-Security-Policy: ${policy}`,
    '  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload',
    '  X-Content-Type-Options: nosniff',
    '  X-Frame-Options: DENY',
    '  Referrer-Policy: strict-origin-when-cross-origin',
    '  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
    '  Cross-Origin-Opener-Policy: same-origin',
    '  Cache-Control: public, max-age=0, must-revalidate',
    '/assets/*',
    '  Cache-Control: public, max-age=31536000, immutable',
    '/assets/img/og.jpg',
    '  Cache-Control: public, max-age=86400',
    '/favicon.svg',
    '  Cache-Control: public, max-age=604800',
    '/apple-touch-icon.png',
    '  Cache-Control: public, max-age=604800',
    '',
  ].join('\n'));
  write(join(OUT, '_redirects'), `https://www.mateuszdombrowski.com/* ${SITE_URL}/:splat 301\n`);
  return policy;
}

// ---------------------------------------------------------------- główny przebieg
async function build() {
  const t0 = Date.now();
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });
  const fonts = buildFonts();
  const [css, js, manifest] = await Promise.all([buildCss(fonts.css), buildJs(), buildImages()]);
  const assets = { cssHref: css, vendorSrc: js.vendor, dragSrc: js.drag, appSrc: js.app, fontPreload: fonts.preload.map((u) => `<link rel="preload" href="${u}" as="font" crossorigin>`).join('\n') };
  assets.qrSvg = await buildVcard();
  const { inlineHashes, urls } = await buildPages(assets, manifest);
  const policy = await buildStatic(inlineHashes, urls);
  // Meta CSP jako zapas (bez frame-ancestors, którego meta nie obsługuje), wstawiana w gotowe strony.
  const metaPolicy = policy.replace(/; frame-ancestors 'none'/, '');
  for (const dirent of walk(OUT)) if (dirent.endsWith('.html') && !dirent.endsWith('google25cec84b609ddea3.html')) {
    const html = read(dirent).replace('<meta charset="utf-8">', `<meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${metaPolicy}">`);
    writeFileSync(dirent, html);
  }
  const total = [...walk(OUT)].reduce((a, f) => a + statSync(f).size, 0);
  console.log(`OK ${((Date.now() - t0) / 1000).toFixed(1)} s, site/ ${(total / 1024).toFixed(0)} KB, CSP hash: ${inlineHashes.join(' ')}`);
}
function* walk(dir) { for (const f of readdirSync(dir)) { const p = join(dir, f); if (statSync(p).isDirectory()) yield* walk(p); else yield p; } }

await build();
if (process.argv.includes('--watch')) {
  let t;
  watch(SRC, { recursive: true }, () => { clearTimeout(t); t = setTimeout(() => build().catch((e) => console.error(e)), 150); });
  console.log('Obserwuję src/ …');
}
