import api from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'manager' | 'cashier';
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    fullName: string;
    username: string;
    role: 'admin' | 'manager' | 'cashier';
  };
}

export interface UserResponse {
  id: number;
  fullName: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'cashier';
  createdAt: string;
  updatedAt: string;
}

export const authService = {
  // Login user
  login: async (data: LoginRequest): Promise<{ data: AuthResponse }> => {
    const response = await api.post('/auth/login', data);
    return { data: response.data };
  },

  // Register new user
  register: async (data: RegisterRequest): Promise<{ data: UserResponse }> => {
    const response = await api.post('/auth/register', data);
    return { data: response.data };
  },

  // Change password (requires authentication)
  changePassword: async (data: ChangePasswordRequest): Promise<{ data: { message: string } }> => {
    const response = await api.patch('/auth/change-password', data);
    return { data: response.data };
  },

  // Get current user profile (if needed)
  getProfile: async (): Promise<{ data: UserResponse }> => {
    const response = await api.get('/auth/me');
    return { data: response.data };
  },
};