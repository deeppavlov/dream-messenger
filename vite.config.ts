import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
        svgo: true,
        svgoConfig: {
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeViewBox: false,
                },
              },
            },
          ],
        },
      },
    }),

    tsconfigPaths(),
  ],
  define: {
    global: 'globalThis',
  },
  css: {
    preprocessorOptions: {
      scss: { additionalData: `@import "./src/styles/index";` },
    },
  },
  resolve: {
    alias: {
      '@assets': new URL('./src/assets', import.meta.url).pathname,
      '@cmpnnts': new URL('./src/components', import.meta.url).pathname,
      '@pages': new URL('./src/pages', import.meta.url).pathname,
      '@styles': new URL('./src/styles', import.meta.url).pathname,
    },
  },
})
