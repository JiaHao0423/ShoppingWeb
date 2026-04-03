import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRoles, setUserRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        const roles = localStorage.getItem('userRoles');
        if (token && roles) {
            setIsAuthenticated(true);
            setUserRoles(JSON.parse(roles));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const data = await AuthService.login(username, password);
            setIsAuthenticated(true);
            setUserRoles(data.roles);
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            setIsAuthenticated(false);
            setUserRoles([]);
            throw error;
        }
    };

    const logout = () => {
        AuthService.logout();
        setIsAuthenticated(false);
        setUserRoles([]);
    };

    const hasRole = (role) => {
        return userRoles.includes(role);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userRoles, loading, login, logout, hasRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);