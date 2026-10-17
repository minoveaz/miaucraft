import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves the project at /miaucraft/ until a custom domain is set.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH ?? '/miaucraft/',
  resolve: {
    // Linked packages resolve their own copies; one React and one three.js instance must be shared.
    dedupe: ['react', 'react-dom', 'three', '@react-three/fiber', '@react-three/drei'],
  },
  optimizeDeps: {
    force: true,
  },
});
