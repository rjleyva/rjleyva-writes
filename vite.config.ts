import { fileURLToPath, URL } from 'url'
import { defineConfig, loadEnv } from 'vite'
import { analyzer } from 'vite-bundle-analyzer'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']]
        }
      }),
      analyzer({
        analyzerMode: 'static',
        openAnalyzer: false,
        fileName: 'bundle-report.html'
      })
    ],
    base: '/',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    define: {
      // Make environment variables available at build time
      __APP_ENV__: JSON.stringify(env['VITE_APP_ENV'] ?? 'development'),
      __APP_VERSION__: JSON.stringify(env['VITE_APP_VERSION'] ?? '0.0.1')
    },
    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: (id: string): string | undefined => {
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
  }
})
