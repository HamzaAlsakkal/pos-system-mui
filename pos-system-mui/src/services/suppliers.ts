import api from './api';
import { Supplier, CreateSupplier, PaginatedResponse, ApiResponse } from '@/types';

export const supplierService = {
  // Get all suppliers with pagination
  getAll: async (page = 1, limit = 10, search = ''): Promise<PaginatedResponse<Supplier>> => {
    const response = await api.get('/suppliers', {
      params: { page, limit, search },
    });
    return response.data;
  },

  // Get all suppliers without pagination (for dropdowns)
  getAllForDropdown: async (): Promise<ApiResponse<Supplier[]>> => {
    const response = await api.get('/suppliers/dropdown');
    return response.data;
  },

  // Get supplier by ID
  getById: async (id: number): Promise<ApiResponse<Supplier>> => {
    const response = await api.get(`/suppliers/${id}`);
    return response.data;
  },

  // Create new supplier
  create: async (supplierData: CreateSupplier): Promise<ApiResponse<Supplier>> => {
    const response = await api.post('/suppliers', supplierData);
    return response.data;
  },

  // Update supplier
  update: async (id: number, supplierData: Partial<CreateSupplier>): Promise<ApiResponse<Supplier>> => {
    const response = await api.put(`/suppliers/${id}`, supplierData);
    return response.data;
  },

  // Delete supplier
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/suppliers/${id}`);
    return response.data;
  },

  // Bulk delete suppliers
  bulkDelete: async (ids: number[]): Promise<ApiResponse<void>> => {
    const response = await api.post('/suppliers/bulk-delete', { ids });
    return response.data;
  },
};