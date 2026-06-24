import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// When deploying to GitHub Pages the app is served from a sub-path
// (https://natan-yago.github.io/AI-survey-2026/). Locally it stays at '/'.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/AI-survey-2026/' : '/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'Deloitte-Master-Logo-Black-RGB.png',
        'welcome-img.png',
        'text comp.png',
      ],
      manifest: {
        name: 'סקר בשלות AI · Deloitte',
        short_name: 'AI Survey',
        description: 'מפת הבשלות והאימוץ של בינה מלאכותית בארגונים בישראל',
        lang: 'he',
        dir: 'rtl',
        theme_color: '#86BC25',
        background_color: '#F7F7F5',
        display: 'standalone',
        start_url: '.',
        scope: '.',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: 'index.html',
      },
    }),
  ],
}));
