// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': { // 當請求路徑以 /axios 開頭時，會被代理到 target
                target: 'http://localhost:8080', // 後端 API 位址
                changeOrigin: true,
                rewrite: (path ) => path.replace(/^\/axios/, '') // 重寫路徑，將 /axios 移除
            }
        }
    }
})