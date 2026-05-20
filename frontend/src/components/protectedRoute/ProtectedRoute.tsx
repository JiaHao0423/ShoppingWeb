import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoading } from "@/components/ui/page-loading";
import { hasAuthSession } from "@/utils/authSession";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const allowed = isAuthenticated && hasAuthSession();

  if (loading) {
    return <PageLoading />;
  }

  if (!allowed) {
    const redirectTo = location.pathname + location.search;
    return <Navigate to={ROUTES.LOGIN} replace state={{ redirectTo }} />;
  }

  return children;
}