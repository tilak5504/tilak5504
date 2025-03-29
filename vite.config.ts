import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Ensures proper asset paths
  define: {
    'process.env.NODE_ENV': '"production"',
  }, // <-- Fixed missing closing brace
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    minify: 'esbuild',  // Ensures a minified production build
    sourcemap: false,    // Removes unnecessary debugging info
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
  },
});