import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

// loginPath is the HASH route path e.g. "/login" (inside HashRouter it maps to #/login)
export default function ProtectedRoute({ children, role, loginPath = "/login" }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={loginPath} replace />;
  }

  if (role && user.role !== role) {
    // Wrong role — they're in the wrong portal, send to login of this portal
    return <Navigate to={loginPath} replace />;
  }

  return children;
}
