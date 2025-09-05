import { DashboardSkeleton } from "@/components/skeleton-loaders/dashboard-skeleton";
import useAuth from "@/hooks/api/use-auth";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { data: authData, isLoading, hasToken, isInitialized, error } = useAuth();
  const user = authData?.user;

  // Wait for initialization
  if (!isInitialized) {
    return <DashboardSkeleton />;
  }

  // If there's no token, redirect immediately
  if (!hasToken) {
    return <Navigate to="/" replace />;
  }

  // If we have a token but still loading, show skeleton
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // If there's an error or no user data, redirect to login
  if (error || !user) {
    return <Navigate to="/" replace />;
  }

  // If we have user data, allow access
  return <Outlet />;
};

export default ProtectedRoute;
