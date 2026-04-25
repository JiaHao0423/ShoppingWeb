import axios, { AxiosError } from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 請求攔截器：在每個請求中加入 token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 回應攔截器：處理錯誤，例如 Token 過期
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error("Token 已失效或權限不足，正在清理登入狀態...");

      localStorage.removeItem("token");

      if (window.location.pathname !== "/" && !window.location.pathname.startsWith("/product")) {
        window.location.href = "/login";
      } else {
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
