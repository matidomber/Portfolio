import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'path'
import { copyFileSync } from 'fs'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Plugin to copy index.html as 404.html for SPA routing on GitHub Pages
const spa404Plugin = () => ({
  name: 'spa-404',
  closeBundle() {
    const outDir = resolve(__dirname, 'dist')
    try {
      copyFileSync(resolve(outDir, 'index.html'), resolve(outDir, '404.html'))
    } catch { /* dist may not exist during dev */ }
  }
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), spa404Plugin()],
  assetsInclude: ['**/*.glb'],
  base: '/', // Custom domain (mateuszdombrowski.com)
})
