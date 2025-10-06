import api from './api';
import { User, CreateUser, PaginatedResponse, ApiResponse } from '@/types';

export const userService = {
  // Get all users with pagination
  getAll: async (page = 1, limit = 10, search = ''): Promise<PaginatedResponse<User>> => {
    const response = await api.get('/users', {
      params: { page, limit, search },
    });
    return response.data;
  },

  // Get user by ID
  getById: async (id: number): Promise<ApiResponse<User>> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Create new user
  create: async (userData: CreateUser): Promise<ApiResponse<User>> => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Update user
  update: async (id: number, userData: Partial<CreateUser>): Promise<ApiResponse<User>> => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Bulk delete users
  bulkDelete: async (ids: number[]): Promise<ApiResponse<void>> => {
    const response = await api.post('/users/bulk-delete', { ids });
    return response.data;
  },
};