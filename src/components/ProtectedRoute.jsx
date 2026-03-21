import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    const fallback =
      user.role === 'system_admin'
        ? '/admin'
        : user.role === 'college_admin'
        ? '/college-admin'
        : '/student';
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
};
