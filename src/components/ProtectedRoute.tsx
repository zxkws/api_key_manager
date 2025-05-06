import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to your existing auth system's login page
    // Replace this URL with your actual auth system login URL
    window.location.href = `${import.meta.env.VITE_AUTH_URL || 'https://zxkws.nyc.mn'}/login?redirect=${window.location.href}`;
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute
