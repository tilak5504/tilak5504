<<<<<<< HEAD
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
=======
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',  // Ensure this is set correctly
  optimizeDeps: {
    exclude: ['lucide-react'],
>>>>>>> 4a713f7 (Deploy to Vercel)
  },
  plugins: [],
};
