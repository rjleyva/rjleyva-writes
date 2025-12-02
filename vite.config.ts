import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import { analyzer } from 'vite-bundle-analyzer'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']]
      }
    }),
    analyzer({
      analyzerMode: 'static',
      openAnalyzer: true,
      fileName: 'bundle-report.html'
    })
  ],
  base: '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000,
    strictPort: true,
    open: true,
    hmr: {
      port: 3000
    }
  }
})
