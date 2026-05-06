import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/constants/routes";
import AuthService from "@/services/authService";
import { hasAdminRole } from "@/utils/roles";
import { PageLoading } from "@/components/ui/page-loading";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <PageLoading />;
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
