/** 登入狀態與 localStorage 同步；供 axios 與 AuthContext 共用 */

export const AUTH_SESSION_EXPIRED_EVENT = "auth:session-expired";

const STORAGE_KEYS = ["token", "refreshToken", "userRoles"] as const;

/** 需登入才能存取的路由前綴 */
export const PROTECTED_ROUTE_PREFIXES = ["/cart", "/orders", "/checkout", "/order-complete", "/member", "/admin"] as const;

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

/** 不需帶 access token 的 API（過期 token 不應影響這些請求） */
export function isPublicApiRequest(url?: string, method?: string): boolean {
  if (!url) return false;
  const path = url.split("?")[0] ?? "";
  const verb = (method ?? "get").toLowerCase();

  if (
    path.startsWith("/auth/login") ||
    path.startsWith("/auth/register") ||
    path.startsWith("/auth/refresh") ||
    path.startsWith("/auth/forgot-password") ||
    path.startsWith("/auth/reset-password")
  ) {
    return true;
  }

  if (verb === "get" && (path === "/products" || (path.startsWith("/products/") && !path.includes("/admin/")))) {
    return true;
  }

  return false;
}

export function getAccessToken(): string | null {
  return localStorage.getItem("token");
}

export function getRefreshToken(): string | null {
  return localStorage.getItem("refreshToken");
}

export function hasAuthSession(): boolean {
  return Boolean(getAccessToken());
}

export function clearAuthStorage(): void {
  for (const key of STORAGE_KEYS) {
    localStorage.removeItem(key);
  }
}

export function persistAuthSession(data: { token: string; refreshToken?: string; roles?: string[] }): void {
  localStorage.setItem("token", data.token);
  if (data.refreshToken) {
    localStorage.setItem("refreshToken", data.refreshToken);
  } else {
    localStorage.removeItem("refreshToken");
  }
  localStorage.setItem("userRoles", JSON.stringify(data.roles ?? []));
}

export function dispatchSessionExpired(): void {
  window.dispatchEvent(new CustomEvent(AUTH_SESSION_EXPIRED_EVENT));
}
