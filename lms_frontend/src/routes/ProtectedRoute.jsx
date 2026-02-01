import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const ProtectedRoute = () => {
  const { auth } = useAuth();

  if (!auth?.token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
