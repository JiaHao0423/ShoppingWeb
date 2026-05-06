import React, { createContext, useCallback, useMemo, useState } from "react";
import AuthService from "@/services/authService";

type AuthUser = {
  token: string;
  refreshToken?: string;
  roles: string[];
};

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
function parseStoredUser(): AuthUser | null {
  const token = localStorage.getItem("token");
  const rawRoles = localStorage.getItem("userRoles");
  if (!token || rawRoles === null) {
    return null;
  }
  try {
    const parsed = JSON.parse(rawRoles) as unknown;
    const roles = Array.isArray(parsed) ? parsed.filter((r): r is string => typeof r === "string") : [];
    return {
      token,
      refreshToken: localStorage.getItem("refreshToken") ?? undefined,
      roles,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialUser = parseStoredUser();
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(initialUser));
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [loading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback((userData: AuthUser) => {
    setIsAuthenticated(true);
    setUser(userData);
    setError(null);
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    AuthService.logout();
    setError(null);
  }, []);

  const isLoggedIn = useCallback(() => isAuthenticated && Boolean(localStorage.getItem("token")), [isAuthenticated]);

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

export function useAuth() {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
