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
  async (error: AxiosError) => {
    const originalRequest = error.config as (typeof error.config & { _retry?: boolean }) | undefined;
    const refreshToken = localStorage.getItem("refreshToken");

    if (
      originalRequest &&
      error.response?.status === 401 &&
      !originalRequest._retry &&
      refreshToken &&
      !String(originalRequest.url ?? "").includes("/auth/refresh")
    ) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post<{ token?: string; refreshToken?: string }>(
          `${apiClient.defaults.baseURL}/auth/refresh`,
          { refreshToken }
        );

        const newAccessToken = refreshResponse.data.token;
        const newRefreshToken = refreshResponse.data.refreshToken;

        if (newAccessToken) {
          localStorage.setItem("token", newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
          }
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error("Refresh token 失敗，請重新登入", refreshError);
      }
    }

    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRoles");

      if (window.location.pathname !== "/" && !window.location.pathname.startsWith("/product")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
