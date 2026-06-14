import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'local-html-storage-middleware',
      configureServer(server) {
        // Vite 내부 Node.js 개발 서버 서버리스 미들웨어 주입
        server.middlewares.use((req, res, next) => {
          if (req.url === '/api/save-page' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              // 1. 고유한 해시 키값 발급 (8자리 랜덤 텍스트)
              const hashKey = Math.random().toString(36).substring(2, 10);
              
              // 2. public 폴더 하위에 임시 저장 폴더 경로 확보
              const dirPath = path.resolve(__dirname, 'public/temp-pages');
              if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
              }

              // 3. 물리 파일 파일 쓰기 저장 (.html)
              const filePath = path.join(dirPath, `${hashKey}.html`);
              fs.writeFileSync(filePath, body);

              // ⏱️ [명세 수용] 정확히 30분 뒤 하드디스크에서 자동 삭제 처리 (30분 * 60초 * 1000ms)
              setTimeout(() => {
                if (fs.existsSync(filePath)) {
                  fs.unlinkSync(filePath);
                  console.log(`[만료 소멸] 임시 페이지 파일이 삭제되었습니다: ${hashKey}.html`);
                }
              }, 30 * 60 * 1000);

              // 4. 프론트엔드에게 키값 반환
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ key: hashKey }));
            });
          } else {
            next();
          }
        });
      }
    }
  ],
  server: {
    // Add the hostnames that are allowed to connect to your dev server
    allowedHosts: ['.ngrok-free.dev']
  },
})
