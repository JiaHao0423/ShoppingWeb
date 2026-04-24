import axios from "axios";


const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// 請求攔截器：在每個請求中加入 JWT Token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // 從 localStorage 獲取 Token
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
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // ✅ 同時處理 401 (Unauthorized) 和 403 (Forbidden)
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.error('Token 已失效或權限不足，正在清理登入狀態...');

            // 清除 localStorage 中的 Token
            localStorage.removeItem('token');

            // 💡 建議：如果是在首頁等公開頁面，可以只清除 Token 不跳轉
            // 如果是在需要權限的頁面，則強制跳轉到登入頁
            if (window.location.pathname !== '/' && !window.location.pathname.startsWith('/product')) {
                window.location.href = '/login';
            } else {
                // 如果在公開頁面，重新整理以訪客身份重新請求
                window.location.reload();
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;