import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function openGraphTransformPlugin(): Plugin {
  return {
    name: 'transform-open-graph',
    transformIndexHtml(html: string) {
      const siteUrl = (process.env.VITE_SITE_URL || 'https://minoveaz.github.io/miaucraft').replace(/\/$/, '');
      return html.replaceAll('%SITE_URL%', siteUrl);
    },
  };
}

// GitHub Pages serves the project at /miaucraft/ until a custom domain is set.
export default defineConfig({
  plugins: [react(), openGraphTransformPlugin()],
  base: process.env.VITE_BASE_PATH ?? '/miaucraft/',
  resolve: {
    // Linked packages resolve their own copies; one React and one three.js instance must be shared.
    dedupe: ['react', 'react-dom', 'three', '@react-three/fiber', '@react-three/drei'],
  },
  optimizeDeps: {
    force: true,
  },
});
