import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AUTH_SESSION_EXPIRED_EVENT, isProtectedRoute } from "@/utils/authSession";
import { ROUTES } from "@/constants/routes";

/**
 * 監聽 axios 清除 session 事件，同步 React 登入狀態。
 * 須放在 BrowserRouter 內。
 */
export function AuthSessionSync() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onExpired = () => {
      logout();

      const path = window.location.pathname;
      if (isProtectedRoute(path)) {
        const redirectTo = path + window.location.search;
        navigate(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(redirectTo)}`, { replace: true });
      }
    };

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, onExpired);
  }, [logout, navigate]);

  /** 多分頁同步：其他分頁登出時更新狀態 */
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === "token" && !event.newValue) {
        logout();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [logout]);

  return null;
}
