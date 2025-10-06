import api from './api';
import { User, CreateUser, PaginatedResponse, ApiResponse } from '@/types';

// Mock users data (since no backend)
const MOCK_USERS: User[] = [
  {
    id: 1,
    fullName: 'Admin User',
    username: 'admin',
    email: 'admin@pos.com',
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    fullName: 'Manager User',
    username: 'manager',
    email: 'manager@pos.com',
    role: 'manager',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    fullName: 'Cashier User',
    username: 'cashier',
    email: 'cashier@pos.com',
    role: 'cashier',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const userService = {
  // Get all users with pagination (MOCK)
  getAll: async (page = 1, limit = 10, search = ''): Promise<PaginatedResponse<User>> => {
    console.log('👥 Mock Users: Getting all users', { page, limit, search });
    await delay(500);
    
    let filteredUsers = MOCK_USERS;
    
    // Apply search filter
    if (search) {
      filteredUsers = MOCK_USERS.filter(user => 
        user.fullName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.username.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    return {
      data: paginatedUsers,
      total: filteredUsers.length,
      page: page,
      limit: limit,
      totalPages: Math.ceil(filteredUsers.length / limit),
    };
  },

  // Get user by ID (MOCK)
  getById: async (id: number): Promise<ApiResponse<User>> => {
    console.log('👤 Mock Users: Getting user by ID', id);
    await delay(300);
    
    const user = MOCK_USERS.find(u => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    
    return { data: user, success: true };
  },

  // Create new user (MOCK)
  create: async (userData: CreateUser): Promise<ApiResponse<User>> => {
    console.log('➕ Mock Users: Creating user', userData.email);
    await delay(800);
    
    // Check for existing user
    const existingUser = MOCK_USERS.find(u => 
      u.email === userData.email || u.username === userData.username
    );
    
    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }
    
    const newUser: User = {
      id: Math.max(...MOCK_USERS.map(u => u.id), 0) + 1,
      fullName: userData.fullName,
      username: userData.username,
      email: userData.email,
      role: userData.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    MOCK_USERS.push(newUser);
    return { data: newUser, success: true };
  },

  // Update user (MOCK)
  update: async (id: number, userData: Partial<CreateUser>): Promise<ApiResponse<User>> => {
    console.log('✏️ Mock Users: Updating user', id);
    await delay(600);
    
    const userIndex = MOCK_USERS.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    const updatedUser = {
      ...MOCK_USERS[userIndex],
      ...userData,
      updatedAt: new Date().toISOString(),
    };
    
    MOCK_USERS[userIndex] = updatedUser;
    return { data: updatedUser, success: true };
  },

  // Delete user (MOCK)
  delete: async (id: number): Promise<ApiResponse<void>> => {
    console.log('🗑️ Mock Users: Deleting user', id);
    await delay(400);
    
    const userIndex = MOCK_USERS.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    MOCK_USERS.splice(userIndex, 1);
    return { data: undefined, success: true };
  },

  // Bulk delete users (MOCK)
  bulkDelete: async (ids: number[]): Promise<ApiResponse<void>> => {
    console.log('🗑️ Mock Users: Bulk deleting users', ids);
    await delay(600);
    
    ids.forEach(id => {
      const userIndex = MOCK_USERS.findIndex(u => u.id === id);
      if (userIndex !== -1) {
        MOCK_USERS.splice(userIndex, 1);
      }
    });
    
    return { data: undefined, success: true };
  },
};