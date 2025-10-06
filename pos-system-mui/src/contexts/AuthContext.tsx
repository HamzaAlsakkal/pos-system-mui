import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/auth';

interface User {
  id: number;
  email: string;
  fullName: string;
  username: string;
  role: 'admin' | 'manager' | 'cashier';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

interface RegisterData {
  fullName: string;
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'manager' | 'cashier';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook with proper export for HMR compatibility
const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    console.log('🔍 Checking for existing auth data...');
    
    const initializeAuth = () => {
      const savedToken = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('authUser');
      
      console.log('💾 Found in localStorage:', { 
        token: savedToken ? 'present' : 'missing', 
        user: savedUser ? 'present' : 'missing' 
      });
      
      if (savedToken && savedUser && savedToken !== 'missing' && savedUser !== 'missing') {
        try {
          const parsedUser = JSON.parse(savedUser);
          
          // Validate that the parsed user has required fields
          if (parsedUser && parsedUser.id && parsedUser.email && parsedUser.role) {
            console.log('✅ Auth restored from localStorage:', parsedUser.email);
            setToken(savedToken);
            setUser(parsedUser);
          } else {
            console.warn('⚠️ Invalid user data structure, clearing localStorage');
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
          }
        } catch (error) {
          console.error('❌ Error parsing saved user data:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
        }
      } else {
        // Clear corrupted localStorage data
        if (savedToken === 'missing' || savedUser === 'missing') {
          console.log('🧹 Clearing corrupted localStorage data...');
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
        }
      }
      
      // Set loading to false after processing
      setLoading(false);
      console.log('🏁 AuthProvider initialization complete');
    };
    
    // Use a small timeout to ensure DOM is ready and prevent hydration issues
    const timeoutId = setTimeout(initializeAuth, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('🔄 Attempting login for:', email);
      setLoading(true);
      
      const response = await authService.login({ email, password });
      console.log('✅ Login successful, processing response...', response.data);
      
      const { access_token, user: userData } = response.data;
      
      // Validate response data
      if (!access_token || !userData) {
        throw new Error('Invalid response from server - missing token or user data');
      }
      
      // Validate user data structure
      if (!userData.id || !userData.email || !userData.role) {
        throw new Error('Invalid user data structure');
      }
      
      console.log('💾 Saving auth data for user:', userData.email);
      
      // Save to localStorage first (synchronously)
      localStorage.setItem('authToken', access_token);
      localStorage.setItem('authUser', JSON.stringify(userData));
      
      // Verify localStorage save
      const verifyToken = localStorage.getItem('authToken');
      const verifyUser = localStorage.getItem('authUser');
      
      if (verifyToken !== access_token || !verifyUser) {
        throw new Error('Failed to save authentication data to localStorage');
      }
      
      // Then set state
      setToken(access_token);
      setUser(userData);
      
      console.log('🎉 Login process completed successfully');
      
      // Set loading to false immediately since everything is done
      setLoading(false);
      
    } catch (error: any) {
      console.error('❌ Login error:', error.response?.data || error.message);
      setLoading(false);
      
      // Clear any partial state
      setToken(null);
      setUser(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      // After registration, you might want to auto-login
      // For now, we'll just return success
      console.log('✅ Registration successful');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('🚪 Logging out user...');
    setLoading(true);
    
    // Clear state first
    setUser(null);
    setToken(null);
    
    // Then clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    
    console.log('✅ Logout completed');
    
    setTimeout(() => {
      setLoading(false);
    }, 100);
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      await authService.changePassword({ oldPassword, newPassword });
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the hook separately for better HMR compatibility
export { useAuth };