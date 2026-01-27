import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // 使用相对路径，兼容 Capacitor 原生应用
  base: './',
  build: {
    // 优化构建输出
    outDir: 'dist',
    assetsDir: 'assets',
    // 生成 sourcemap 便于调试
    sourcemap: false,
    // 分割代码
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
  server: {
    // 开发服务器配置
    host: true,
    port: 5173,
  },
})
