/**
 * Protected Route Component
 * Wrapper for routes that require authentication
 */

import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import { hasRouteAccess } from '../config/permissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

/**
 * ProtectedRoute component that guards routes requiring authentication
 * Redirects to login if user is not authenticated
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth() as any;
  const location = useLocation();
  const currentPath = location.pathname.replace(/\/+$/, '') || '/';
  const userPermissions = user?.roleId?.permissions || [];

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  // For public routes (requireAuth=false)
  if (!requireAuth) {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
      return <Navigate to="/dashboards/default" replace />;
    }
    return <>{children}</>;
  }

  // For protected routes (requireAuth=true)
  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  // Route-level permission guard to block direct URL access
  const canAccessRoute = hasRouteAccess(userPermissions, currentPath);
  if (!canAccessRoute) {
    return <Navigate to="/errors/403" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
