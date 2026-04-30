import React, { createContext, useMemo, useState } from "react";
import AuthService from "../services/authService";

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

const token = localStorage.getItem("token");
const refreshToken = localStorage.getItem("refreshToken");
const roles = localStorage.getItem("userRoles");
const initialUser = token && roles ? { token, refreshToken: refreshToken ?? undefined, roles: JSON.parse(roles) as string[] } : null;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(initialUser));
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [loading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = (userData: AuthUser) => {
    setIsAuthenticated(true);
    setUser(userData);
    setError(null);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    AuthService.logout();
    setError(null);
  };

  const isLoggedIn = () => isAuthenticated && !!localStorage.getItem("token");

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
    [error, isAuthenticated, loading, user]
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
