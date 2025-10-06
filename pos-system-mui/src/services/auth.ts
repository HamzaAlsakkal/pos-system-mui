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

// Mock users for testing (since no backend)
const MOCK_USERS = [
  {
    id: 1,
    email: 'admin@pos.com',
    password: 'admin123',
    fullName: 'Admin User',
    username: 'admin',
    role: 'admin' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    email: 'manager@pos.com',
    password: 'manager123',
    fullName: 'Manager User',
    username: 'manager',
    role: 'manager' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    email: 'cashier@pos.com',
    password: 'cashier123',
    fullName: 'Cashier User',
    username: 'cashier',
    role: 'cashier' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Generate a mock JWT token
const generateMockToken = (userId: number): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    sub: userId, 
    iat: Date.now() / 1000, 
    exp: (Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  }));
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  // Login user (MOCK - No Backend)
  login: async (data: LoginRequest): Promise<{ data: AuthResponse }> => {
    console.log('🔐 Mock Login attempt for:', data.email);
    
    // Simulate API delay
    await delay(800);
    
    // Find user in mock database
    const user = MOCK_USERS.find(u => u.email === data.email && u.password === data.password);
    
    if (!user) {
      console.log('❌ Mock Login failed: Invalid credentials');
      throw new Error('Invalid email or password');
    }
    
    const token = generateMockToken(user.id);
    const response: AuthResponse = {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        username: user.username,
        role: user.role,
      },
    };
    
    console.log('✅ Mock Login successful for:', user.email);
    return { data: response };
  },

  // Register new user (MOCK - No Backend)
  register: async (data: RegisterRequest): Promise<{ data: UserResponse }> => {
    console.log('📝 Mock Register attempt for:', data.email);
    
    // Simulate API delay
    await delay(1000);
    
    // Check if user already exists
    const existingUser = MOCK_USERS.find(u => u.email === data.email || u.username === data.username);
    if (existingUser) {
      console.log('❌ Mock Register failed: User already exists');
      throw new Error('User with this email or username already exists');
    }
    
    // Create new user
    const newUser: UserResponse = {
      id: MOCK_USERS.length + 1,
      fullName: data.fullName,
      username: data.username,
      email: data.email,
      role: data.role || 'cashier',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Add to mock database
    MOCK_USERS.push({
      ...newUser,
      password: data.password,
    });
    
    console.log('✅ Mock Register successful for:', data.email);
    return { data: newUser };
  },

  // Change password (MOCK - No Backend)
  changePassword: async (data: ChangePasswordRequest): Promise<{ data: { message: string } }> => {
    console.log('🔑 Mock Change Password attempt');
    
    // Simulate API delay
    await delay(500);
    
    // In a real app, you'd verify the old password and update it
    console.log('✅ Mock Change Password successful');
    return { data: { message: 'Password changed successfully' } };
  },

  // Get current user profile (MOCK - No Backend)
  getProfile: async (): Promise<{ data: UserResponse }> => {
    console.log('👤 Mock Get Profile attempt');
    
    // Simulate API delay
    await delay(300);
    
    // For mock purposes, return admin user
    const user = MOCK_USERS[0];
    const response: UserResponse = {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    
    console.log('✅ Mock Get Profile successful');
    return { data: response };
  },
};