import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

// requireAdmin: pass true to restrict a route to admin users only
const ProtectedRoute = ({ requireAdmin = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
