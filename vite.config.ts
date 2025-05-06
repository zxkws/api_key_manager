import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: 'api_key_manager',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
