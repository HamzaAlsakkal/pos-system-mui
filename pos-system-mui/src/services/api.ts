import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 API Request: Adding Bearer token to', config.url);
    } else {
      console.log('⚠️ API Request: No token found for', config.url);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Success:', response.config?.url, response.status);
    return response;
  },
  (error: AxiosError) => {
    console.log('❌ API Error:', error.response?.status, error.config?.url, error.response?.data);
    
    if (error.response?.status === 401) {
      // Only redirect to auth if it's not a login/register attempt
      const isAuthRequest = error.config?.url?.includes('/auth/login') || 
                           error.config?.url?.includes('/auth/register');
      
      if (!isAuthRequest) {
        console.log('🚫 Unauthorized access detected for non-auth request');
        
        // Check if we have valid tokens before clearing
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('authUser');
        
        if (token && user && token !== 'missing' && user !== 'missing') {
          console.log('⚠️ Valid token exists but request was unauthorized, clearing auth data');
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
          
          // Only redirect if not already on auth page
          if (!window.location.pathname.includes('/auth') && !window.location.pathname.includes('/login')) {
            console.log('🔄 Redirecting to auth page');
            // Use a gentle redirect with a small delay
            setTimeout(() => {
              window.location.href = '/auth';
            }, 500);
          }
        } else {
          console.log('ℹ️ No valid auth data found, user likely already logged out');
        }
      } else {
        console.log('ℹ️ Auth request failed (expected for invalid credentials)');
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;