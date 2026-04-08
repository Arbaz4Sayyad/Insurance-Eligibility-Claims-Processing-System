import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  // If user role is not in allowedRoles, redirect to an "Unauthorized" page
  if (user && allowedRoles && !allowedRoles.includes(user.role)) {
    console.warn(`Access denied for role: ${user.role}. Allowed: ${allowedRoles}`);
    return <Navigate to="/unauthorized" replace />;
  }

  // Wrap the authenticated content (children or Outlet) in ProtectedRoute
  return (
    <ProtectedRoute>
      {children ? children : <Outlet />}
    </ProtectedRoute>
  );
};

export default RoleBasedRoute;

