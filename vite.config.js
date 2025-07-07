import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/shelter': {
        target: 'https://www.safetydata.go.kr',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/shelter/, '/V2/api/DSSP-IF-10942'),
      },
    },
  }
});
