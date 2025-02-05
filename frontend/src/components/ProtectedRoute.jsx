import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
