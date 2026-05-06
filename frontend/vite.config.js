// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
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