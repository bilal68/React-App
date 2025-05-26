import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  isLoggedIn: boolean;
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isLoggedIn,
  redirectPath = "/",
}) => {
  if (!isLoggedIn) {
    // Redirect to the specified path (default: landing page)
    return <Navigate to={redirectPath} replace />;
  }

  // Render the child routes if logged in
  return <Outlet />;
};

export default ProtectedRoute;
