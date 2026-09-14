import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // Registered by hand in main.tsx. autoUpdate installs a new worker but
      // the page keeps the old one until every tab for the origin is closed —
      // so an app left open, or added to a home screen, can serve a build from
      // days ago and look like the deploy never happened.
      injectRegister: null,
      includeAssets: ['favicon.svg'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff,woff2}'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
      },
      manifest: {
        name: 'Passerelle — французька українською',
        short_name: 'Passerelle',
        description:
          'Курс французької мови для українців: від A0 до B2. Офлайн, з озвучкою, інтервальними повтореннями та розмовною практикою.',
        lang: 'uk',
        theme_color: '#1e2a5a',
        background_color: '#faf7f2',
        display: 'standalone',
        start_url: './',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
