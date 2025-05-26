import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

interface ProtectedRouteProps {
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectPath = "/",
}) => {
  const { authToken } = useAppContext();
  const isLoggedIn = !!authToken;
  if (!isLoggedIn) {
    // Redirect to the specified path (default: landing page)
    return <Navigate to={redirectPath} replace />;
  }

  // Render the child routes if logged in
  return <Outlet />;
};

export default ProtectedRoute;
