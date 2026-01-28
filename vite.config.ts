import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'lucide-react': fileURLToPath(new URL('./src/shims/lucide-react.tsx', import.meta.url)),
      'react-router-dom': fileURLToPath(new URL('./src/shims/react-router-dom.tsx', import.meta.url))
    }
  }
});
