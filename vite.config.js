import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/shelter1': {
        target: 'https://www.safetydata.go.kr',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/shelter1/, '/V2/api/DSSP-IF-10942'),
      },
      '/state1': {
        target: 'https://apis.data.go.kr', //  Base URL 부분
        changeOrigin: true,
        rewrite: path => path.replace(/^\/state1/, '/1741000/CasualtiesFromHeatwaveByYear/getCasualtiesFromHeatwaveByYear'), // 실제 API목록 부분
      }
    },
  }
});
