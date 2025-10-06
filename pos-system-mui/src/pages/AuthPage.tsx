import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard if user is already logged in
    if (!loading && user) {
      console.log('🔄 AuthPage: User already logged in, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  // Show loading while checking auth status
  if (loading) {
    return <div>Loading...</div>;
  }

  // Don't render auth forms if user is logged in
  if (user) {
    return null;
  }

  const switchToRegister = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  return (
    <>
      {isLogin ? (
        <LoginPage onSwitchToRegister={switchToRegister} />
      ) : (
        <RegisterPage onSwitchToLogin={switchToLogin} />
      )}
    </>
  );
};

export default AuthPage;