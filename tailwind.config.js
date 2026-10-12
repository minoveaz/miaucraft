/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Rosa de marca (decorativo y bordes).
        brand: {
          DEFAULT: '#E52C77',
          // Fondo de botones y texto rosa; con texto blanco supera WCAG AA (4.5:1).
          strong: '#C81E63',
          soft: '#FFE0E4',
          cream: '#FFF8F1',
          ink: '#101010',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
