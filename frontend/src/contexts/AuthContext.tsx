import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import AuthService from "@/services/authService";
import { AUTH_SESSION_EXPIRED_EVENT, hasAuthSession } from "@/utils/authSession";

//型別定義登入使用者資料
type AuthUser = {
  token: string;
  refreshToken?: string;
  roles: string[];
};

//型別定義AuthContext的值
type AuthContextValue = {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (userData: AuthUser) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** 從 localStorage 還原登入狀態；格式異常時回傳 null，避免 JSON.parse 拋錯導致白屏 */
//以 token 為準：沒有 token 就視為未登入。
function parseStoredUser(): AuthUser | null {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }
  let roles: string[] = [];
  //userRoles 防呆，避免壞資料造成白屏。
  const rawRoles = localStorage.getItem("userRoles");
  if (rawRoles) {
    try {
      const parsed = JSON.parse(rawRoles) as unknown;
      roles = Array.isArray(parsed) ? parsed.filter((r): r is string => typeof r === "string") : [];
    } catch {
      roles = [];
    }
  }
  return {
    token,
    refreshToken: localStorage.getItem("refreshToken") ?? undefined,
    roles,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  //初始化:第一次載入時就從 localStorage 還原，即使刷新頁面也會保留（只要 token 還在）。
  const initialUser = parseStoredUser();
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(initialUser));
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [loading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //只更新 React state（isAuthenticated、user、清掉 error），不寫 localStorage。
  const login = useCallback((userData: AuthUser) => {
    setIsAuthenticated(true);
    setUser(userData);
    setError(null);
  }, []);

  //先清 React state，再清掉 localStorage。
  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    AuthService.logout();
    setError(null);
  }, []);

  //每次頁面載入時都重新同步 localStorage 狀態。
  //同步 localStorage 狀態，避免 React state 與 localStorage 不同步。
  //Session 過期監聽事件處理：當 Session 過期時，重新同步 localStorage 狀態。
  useEffect(() => {
    const syncFromStorage = () => {
      const stored = parseStoredUser();
      if (stored) {
        setIsAuthenticated(true);
        setUser(stored);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    const onExpired = () => syncFromStorage();

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, onExpired);
  }, []);

  //以 localStorage 為準：有 token 就視為已登入。
  const isLoggedIn = useCallback(() => hasAuthSession(), []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      loading,
      error,
      login,
      logout,
      isLoggedIn,
    }),
    [error, isAuthenticated, isLoggedIn, loading, login, logout, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

//自定義 hook，使用 useContext 取得 AuthContext 的值。
export function useAuth() {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
