import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      proxy: {
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
})
