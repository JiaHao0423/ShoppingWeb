import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../services/authService';

// 建立 Context
export const AuthContext = createContext();

// 建立 Provider 組件
export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 初始化：應用啟動時檢查 localStorage 中是否有 Token
    useEffect(() => {
        const token = localStorage.getItem('token');
        const roles = localStorage.getItem('userRoles');

        if (token && roles) {
            setIsAuthenticated(true);
            setUser({
                token: token,
                roles: JSON.parse(roles)
            });
        }

        setLoading(false);
    }, []);

    // 登入方法
    const login = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
        setError(null);
    };

    // 登出方法
    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        AuthService.logout(); // 清除 localStorage
        setError(null);
    };

    // 檢查是否已認證
    const isLoggedIn = () => {
        return isAuthenticated && !!localStorage.getItem('jwtToken');
    };

    const value = {
        isAuthenticated,
        user,
        loading,
        error,
        login,
        logout,
        isLoggedIn,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// 建立 useAuth Hook，方便在組件中使用
export function useAuth() {
    const context = React.useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }

    return context;
}
