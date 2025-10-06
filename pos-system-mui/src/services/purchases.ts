import api from './api';
import { Purchase, CreatePurchase, PurchaseItem, CreatePurchaseItem, PaginatedResponse, ApiResponse } from '@/types';

export const purchaseService = {
  // Get all purchases with pagination
  getAll: async (page = 1, limit = 10, search = '', status?: string): Promise<PaginatedResponse<Purchase>> => {
    const response = await api.get('/purchases', {
      params: { page, limit, search, status },
    });
    return response.data;
  },

  // Get recent purchases
  getRecent: async (limit = 10): Promise<ApiResponse<Purchase[]>> => {
    const response = await api.get('/purchases/recent', {
      params: { limit },
    });
    return response.data;
  },

  // Get purchases by date range
  getByDateRange: async (startDate: string, endDate: string): Promise<ApiResponse<Purchase[]>> => {
    const response = await api.get('/purchases/date-range', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  // Get purchase by ID with items
  getById: async (id: number): Promise<ApiResponse<Purchase & { items: PurchaseItem[] }>> => {
    const response = await api.get(`/purchases/${id}`);
    return response.data;
  },

  // Create new purchase with items
  create: async (purchaseData: CreatePurchase & { items: CreatePurchaseItem[] }): Promise<ApiResponse<Purchase>> => {
    const response = await api.post('/purchases', purchaseData);
    return response.data;
  },

  // Update purchase
  update: async (id: number, purchaseData: Partial<CreatePurchase>): Promise<ApiResponse<Purchase>> => {
    const response = await api.put(`/purchases/${id}`, purchaseData);
    return response.data;
  },

  // Cancel purchase
  cancel: async (id: number): Promise<ApiResponse<Purchase>> => {
    const response = await api.patch(`/purchases/${id}/cancel`);
    return response.data;
  },

  // Complete purchase
  complete: async (id: number): Promise<ApiResponse<Purchase>> => {
    const response = await api.patch(`/purchases/${id}/complete`);
    return response.data;
  },

  // Delete purchase
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/purchases/${id}`);
    return response.data;
  },

  // Get purchases summary
  getSummary: async (period = 'month'): Promise<ApiResponse<{
    totalPurchases: number;
    totalAmount: number;
    averageAmount: number;
    topSuppliers: Array<{ supplier: string; orders: number; amount: number }>;
  }>> => {
    const response = await api.get('/purchases/summary', {
      params: { period },
    });
    return response.data;
  },
};