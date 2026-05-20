import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/constants/routes";
import AuthService from "@/services/authService";
import { hasAdminRole } from "@/utils/roles";
import { hasAuthSession } from "@/utils/authSession";
import { PageLoading } from "@/components/ui/page-loading";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();
  const allowed = isAuthenticated && hasAuthSession();

  if (loading) {
    return <PageLoading />;
  }
  if (!allowed) {
    const redirectTo = location.pathname + location.search;
    return <Navigate to={ROUTES.LOGIN} replace state={{ redirectTo }} />;
  }

  const mergedRoles = [...new Set([...(user?.roles ?? []), ...AuthService.getUserRoles()])];
  if (!hasAdminRole(mergedRoles)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
}
