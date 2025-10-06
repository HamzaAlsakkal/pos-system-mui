import api from './api';
import { Customer, CreateCustomer, PaginatedResponse, ApiResponse } from '@/types';

export const customerService = {
  // Get all customers with pagination
  getAll: async (page = 1, limit = 10, search = ''): Promise<PaginatedResponse<Customer>> => {
    const response = await api.get('/customers', {
      params: { page, limit, search },
    });
    return response.data;
  },

  // Get all customers without pagination (for dropdowns)
  getAllForDropdown: async (): Promise<ApiResponse<Customer[]>> => {
    const response = await api.get('/customers/dropdown');
    return response.data;
  },

  // Get customer by ID
  getById: async (id: number): Promise<ApiResponse<Customer>> => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  // Create new customer
  create: async (customerData: CreateCustomer): Promise<ApiResponse<Customer>> => {
    const response = await api.post('/customers', customerData);
    return response.data;
  },

  // Update customer
  update: async (id: number, customerData: Partial<CreateCustomer>): Promise<ApiResponse<Customer>> => {
    const response = await api.put(`/customers/${id}`, customerData);
    return response.data;
  },

  // Delete customer
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  },

  // Bulk delete customers
  bulkDelete: async (ids: number[]): Promise<ApiResponse<void>> => {
    const response = await api.post('/customers/bulk-delete', { ids });
    return response.data;
  },
};