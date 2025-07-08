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
      '/state': {
        target: 'https://apis.data.go.kr', //  Base URL 부분
        changeOrigin: true,
        rewrite: path => path.replace(/^\/state/, '/1741000/CasualtiesFromHeatwaveByYear/getCasualtiesFromHeatwaveByYear'), // 실제 API목록 부분
      }
    },
  }
});
