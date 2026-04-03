import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'; // 使用環境變數或代理路徑

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 請求攔截器：在每個請求中加入 JWT Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken'); // 從 localStorage 獲取 Token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 回應攔截器：處理錯誤，例如 Token 過期
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token 過期或無效，導向登入頁面或清除 Token
            console.error('Unauthorized, logging out...');
            localStorage.removeItem('jwtToken');
            // window.location.href = '/login'; // 根據您的路由設定調整
        }
        return Promise.reject(error);
    }
);

export default api;