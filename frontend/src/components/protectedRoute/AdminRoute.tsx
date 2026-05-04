import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ROUTES } from "../../constants/routes";
import AuthService from "../../services/authService";
import { hasAdminRole } from "../../utils/roles";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <div>載入中...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const mergedRoles = [...new Set([...(user?.roles ?? []), ...AuthService.getUserRoles()])];
  if (!hasAdminRole(mergedRoles)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
}
