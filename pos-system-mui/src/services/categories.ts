import api from './api';
import { Category, CreateCategory, PaginatedResponse, ApiResponse } from '@/types';

export const categoryService = {
  // Get all categories with pagination
  getAll: async (page = 1, limit = 10, search = ''): Promise<PaginatedResponse<Category>> => {
    const response = await api.get('/categories', {
      params: { page, limit, search },
    });
    return response.data;
  },

  // Get all categories without pagination (for dropdowns)
  getAllForDropdown: async (): Promise<ApiResponse<Category[]>> => {
    const response = await api.get('/categories/dropdown');
    return response.data;
  },

  // Get category by ID
  getById: async (id: number): Promise<ApiResponse<Category>> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // Create new category
  create: async (categoryData: CreateCategory): Promise<ApiResponse<Category>> => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  // Update category
  update: async (id: number, categoryData: Partial<CreateCategory>): Promise<ApiResponse<Category>> => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  // Delete category
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },

  // Bulk delete categories
  bulkDelete: async (ids: number[]): Promise<ApiResponse<void>> => {
    const response = await api.post('/categories/bulk-delete', { ids });
    return response.data;
  },
};