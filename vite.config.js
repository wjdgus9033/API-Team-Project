import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const useProxy = env.VITE_ENV_TYPE === 'dev'; // # VITE_ENV_TYPE 값이 'dev'면 개발, 'prod'면 배포

  return {
    plugins: [react()],
    base: "/HeatGuard/",
    server: {
      proxy: useProxy ? {
        '/shelter1': {
          target: 'https://www.safetydata.go.kr',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/shelter1/, '/V2/api/DSSP-IF-10942'),
        },
        '/state1': {
          target: 'https://apis.data.go.kr',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/state1/, '/1741000/CasualtiesFromHeatwaveByYear/getCasualtiesFromHeatwaveByYear'),
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
      } : undefined
    }
  };
});
