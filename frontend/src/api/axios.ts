import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import {
  clearAuthStorage,
  dispatchSessionExpired,
  getAccessToken,
  getRefreshToken,
  isPublicApiRequest,
  persistAuthSession,
} from "@/utils/authSession";

/** 生產環境預設走同網域 Nginx `/api` 代理；開發環境才連本機後端 */
const apiBaseURL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.PROD ? "/api" : "http://localhost:8080/api");

const apiClient = axios.create({
  baseURL: apiBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

type RetryConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  _retryWithoutAuth?: boolean;
};

/** 並發 401 時共用同一個 refresh，避免 refresh token 旋轉競態 */
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const refreshResponse = await axios.post<{
          token?: string;
          refreshToken?: string;
          roles?: string[];
        }>(`${apiBaseURL}/auth/refresh`, { refreshToken });

        const newAccessToken = refreshResponse.data.token;
        if (!newAccessToken) return null;

        persistAuthSession({
          token: newAccessToken,
          refreshToken: refreshResponse.data.refreshToken,
          roles: refreshResponse.data.roles,
        });
        return newAccessToken;
      } catch (refreshError) {
        console.error("Refresh token 失敗，請重新登入", refreshError);
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
}

function stripAuthorization(config: RetryConfig): RetryConfig {
  if (!config.headers) return config;
  const headers = config.headers as Record<string, unknown>;
  delete headers.Authorization;
  delete headers.authorization;
  return config;
}

function handleSessionExpired(): void {
  clearAuthStorage();
  dispatchSessionExpired();
}

apiClient.interceptors.request.use(
  (config) => {
    const retryConfig = config as RetryConfig;
    const url = retryConfig.url ?? "";
    const method = retryConfig.method;

    if (retryConfig._retryWithoutAuth || isPublicApiRequest(url, method)) {
      return stripAuthorization(retryConfig);
    }

    const token = getAccessToken();
    if (token) {
      retryConfig.headers = retryConfig.headers ?? {};
      retryConfig.headers.Authorization = `Bearer ${token}`;
    }
    return retryConfig;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig | undefined;
    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const requestUrl = String(originalRequest.url ?? "");
    const isRefreshCall = requestUrl.includes("/auth/refresh");
    const isPublicApi = isPublicApiRequest(requestUrl, originalRequest.method);

    if (status === 401 && isPublicApi && !originalRequest._retryWithoutAuth) {
      originalRequest._retryWithoutAuth = true;
      return apiClient(stripAuthorization(originalRequest));
    }

    if (
      status === 401 &&
      !originalRequest._retry &&
      !isRefreshCall &&
      !isPublicApi &&
      getRefreshToken()
    ) {
      originalRequest._retry = true;
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      }
    }

    if (status === 401 || status === 403) {
      const isAuthFlow =
        requestUrl.includes("/auth/login") ||
        requestUrl.includes("/auth/register") ||
        requestUrl.includes("/auth/forgot-password") ||
        requestUrl.includes("/auth/reset-password");

      if (!isAuthFlow && !isRefreshCall) {
        handleSessionExpired();
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
