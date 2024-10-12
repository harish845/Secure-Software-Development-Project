import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const role = localStorage.getItem('role');
  if (role === requiredRole) {
    return children;
  }
  return <Navigate to="/" />;
};

export default ProtectedRoute;
