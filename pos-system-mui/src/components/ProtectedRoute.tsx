import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'manager' | 'cashier';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, loading, token } = useAuth();
  const location = useLocation();
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    console.log('🛡️ ProtectedRoute state change:', { 
      user: user ? user.email : 'null', 
      loading, 
      token: token ? 'present' : 'missing',
      requiredRole,
      path: location.pathname,
      initialLoadComplete
    });

    // Mark initial load as complete after a brief delay
    if (!loading && !initialLoadComplete) {
      const timer = setTimeout(() => {
        setInitialLoadComplete(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [user, loading, token, location.pathname, requiredRole, initialLoadComplete]);

  // Show loading spinner while auth is being determined
  if (loading || !initialLoadComplete) {
    console.log('⏳ ProtectedRoute: Still loading auth state...');
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  // Check if user is authenticated
  if (!user || !token) {
    console.log('🚫 ProtectedRoute: No user or token found, redirecting to /auth');
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  console.log('✅ ProtectedRoute: User authenticated, checking permissions for:', location.pathname);

  // Check role permissions
  if (requiredRole) {
    const roleHierarchy = {
      admin: 3,
      manager: 2,
      cashier: 1,
    };

    const userLevel = roleHierarchy[user.role];
    const requiredLevel = roleHierarchy[requiredRole];

    if (userLevel < requiredLevel) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            gap: 2,
          }}
        >
          <Typography variant="h5" color="error">
            Access Denied
          </Typography>
          <Typography color="text.secondary">
            You don't have permission to access this page.
          </Typography>
        </Box>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;