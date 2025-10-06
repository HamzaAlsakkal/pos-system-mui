import api from './api';
import { Sale, CreateSale, SaleItem, CreateSaleItem, PaginatedResponse, ApiResponse } from '@/types';

export const saleService = {
  // Get all sales with pagination
  getAll: async (page = 1, limit = 10, search = '', status?: string): Promise<PaginatedResponse<Sale>> => {
    const response = await api.get('/sales', {
      params: { page, limit, search, status },
    });
    return response.data;
  },

  // Get recent sales
  getRecent: async (limit = 10): Promise<ApiResponse<Sale[]>> => {
    const response = await api.get('/sales/recent', {
      params: { limit },
    });
    return response.data;
  },

  // Get sales by date range
  getByDateRange: async (startDate: string, endDate: string): Promise<ApiResponse<Sale[]>> => {
    const response = await api.get('/sales/date-range', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  // Get sale by ID with items
  getById: async (id: number): Promise<ApiResponse<Sale & { items: SaleItem[] }>> => {
    const response = await api.get(`/sales/${id}`);
    return response.data;
  },

  // Create new sale with items
  create: async (saleData: CreateSale & { items: CreateSaleItem[] }): Promise<ApiResponse<Sale>> => {
    const response = await api.post('/sales', saleData);
    return response.data;
  },

  // Update sale
  update: async (id: number, saleData: Partial<CreateSale>): Promise<ApiResponse<Sale>> => {
    const response = await api.put(`/sales/${id}`, saleData);
    return response.data;
  },

  // Cancel sale
  cancel: async (id: number): Promise<ApiResponse<Sale>> => {
    const response = await api.patch(`/sales/${id}/cancel`);
    return response.data;
  },

  // Complete sale
  complete: async (id: number): Promise<ApiResponse<Sale>> => {
    const response = await api.patch(`/sales/${id}/complete`);
    return response.data;
  },

  // Delete sale
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/sales/${id}`);
    return response.data;
  },

  // Get sales summary
  getSummary: async (period = 'month'): Promise<ApiResponse<{
    totalSales: number;
    totalAmount: number;
    averageAmount: number;
    topProducts: Array<{ product: string; quantity: number; revenue: number }>;
  }>> => {
    const response = await api.get('/sales/summary', {
      params: { period },
    });
    return response.data;
  },
};