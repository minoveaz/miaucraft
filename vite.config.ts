import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves the project at /miaucraft/ until a custom domain is set.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH ?? '/miaucraft/',
});
