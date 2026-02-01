import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const RoleGuard = ({ allowedRoles, children }) => {
  const { auth } = useAuth();

  if (!allowedRoles.includes(auth?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleGuard;
