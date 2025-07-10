import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/shelter': {
          target: 'https://www.safetydata.go.kr',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/shelter/, '/V2/api/DSSP-IF-10942'),
        },
        '/state': {
          target: 'https://apis.data.go.kr',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/state/, '/1741000/CasualtiesFromHeatwaveByYear/getCasualtiesFromHeatwaveByYear'),
        },
        '/api/naver': {
          target: 'https://openapi.naver.com',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/naver/, ''),
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              proxyReq.setHeader('X-Naver-Client-Id', env.VITE_NAVER_CLIENT_ID);
              proxyReq.setHeader('X-Naver-Client-Secret', env.VITE_NAVER_CLIENT_SECRET);
            });
          }
        }
      }
    }
  }
});