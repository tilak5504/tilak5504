import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      fastRefresh: false, // Disable React Fast Refresh in production
    }),
  ],
  base: './', // Ensures correct asset paths for deployment
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    minify: 'esbuild',  // Minifies the production build
    sourcemap: false,   // Removes debugging info
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
  },
});
