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
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: id => {
          if (
            id.includes('react') ||
            id.includes('react-dom') ||
            id.includes('react-router')
          ) {
            return 'react-vendor'
          }
          if (
            id.includes('unified') ||
            id.includes('remark-') ||
            id.includes('rehype-')
          ) {
            return 'markdown-vendor'
          }
          if (id.includes('modern-normalize')) {
            return 'ui-vendor'
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    minify: 'esbuild'
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
