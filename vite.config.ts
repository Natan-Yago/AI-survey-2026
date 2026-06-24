import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// When deploying to GitHub Pages the app is served from a sub-path
// (https://natan-yago.github.io/AI-survey-2026/). Locally it stays at '/'.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/AI-survey-2026/' : '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
}));
