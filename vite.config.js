import { defineConfig } from 'vite'

export default defineConfig({
  // Base path for GitHub Pages (criech.github.io/anne/)
  base: '/anne/',
  // Serve brand_assets from public folder
  publicDir: 'public',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist'
  }
})
