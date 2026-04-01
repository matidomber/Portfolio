/**
 * compress-assets.mjs
 * One-shot script to compress the 3D assets for the Lanyard component.
 *
 * Requires Node.js >= 18. Run from repo root:
 *   node scripts/compress-assets.mjs
 */

import { execSync } from 'child_process';
import { existsSync, statSync, renameSync, copyFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const GLB_IN  = resolve(root, 'src/lanyard/card.glb');
const GLB_OUT = resolve(root, 'src/lanyard/card.glb');
const PNG_IN  = resolve(root, 'src/lanyard/lanyard.png');
const PNG_OUT = resolve(root, 'src/lanyard/lanyard.png');

function sizeMB(path) {
  return (statSync(path).size / 1024 / 1024).toFixed(2) + ' MB';
}

function run(cmd) {
  execSync(cmd, { stdio: 'inherit', cwd: root });
}

console.log('\n🗜  Portfolio Asset Compression\n');

/* ── GLB (card model) ─────────────────────────────────────────── */
console.log(`📦  GLB before: ${sizeMB(GLB_IN)}`);

// Backup original
const GLB_BACKUP = GLB_IN + '.orig';
copyFileSync(GLB_IN, GLB_BACKUP);

try {
  // @gltf-transform/cli installed on-the-fly via npx
  run(
    `npx --yes @gltf-transform/cli optimize "${GLB_IN}" "${GLB_OUT}" --compress draco`
  );
  console.log(`✅  GLB after:  ${sizeMB(GLB_OUT)}`);
} catch (err) {
  console.error('❌  GLB compression failed, restoring original');
  copyFileSync(GLB_BACKUP, GLB_OUT);
  throw err;
}

/* ── PNG (lanyard texture) ────────────────────────────────────── */
console.log(`\n🖼   PNG before: ${sizeMB(PNG_IN)}`);

// Compress in-place using sharp (installed on-the-fly)
const sharpScript = `
import sharp from 'sharp';
await sharp('${PNG_IN.replace(/\\/g, '\\\\')}')
  .png({ compressionLevel: 9, quality: 85, effort: 10 })
  .toFile('${PNG_OUT.replace(/\\/g, '\\\\')}');
console.log('sharp: done');
`.trim();

// Write temp script
import { writeFileSync, unlinkSync } from 'fs';
const tmpScript = resolve(root, 'scripts/_tmp_compress_png.mjs');
writeFileSync(tmpScript, sharpScript);

try {
  run(`npx --yes sharp-cli -i "${PNG_IN}" -o "${PNG_OUT}" --optimise`);
  console.log(`✅  PNG after:  ${sizeMB(PNG_OUT)}`);
} catch {
  // Fallback: use sharp module directly
  try {
    run(`node --input-type=module -e "${sharpScript.replace(/"/g, '\\"')}"`);
    console.log(`✅  PNG after:  ${sizeMB(PNG_OUT)}`);
  } catch (err2) {
    console.warn('⚠️   PNG compression skipped (sharp unavailable) — not critical');
  }
} finally {
  try { unlinkSync(tmpScript); } catch {}
}

console.log('\n🎉  Done! Commit the updated assets to reduce initial load time.\n');
