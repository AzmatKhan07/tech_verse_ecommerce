import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const user = useCurrentUser();
  const location = useLocation();

  // If user is not authenticated, redirect to signin
  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If user role is not in allowed roles, redirect to homepage
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
