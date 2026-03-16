import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Front-End-Notes/', // GitHub Pages 部署子路径
  server: {
    port: 3000,
    // 如果端口被占用，自动尝试下一个可用端口
    strictPort: false
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
