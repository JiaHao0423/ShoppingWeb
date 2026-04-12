import React from 'react';
import { Navigate } from 'react-router-dom';
import {useAuth} from "../../contexts/AuthContext.jsx";

export function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>載入中...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
