import api from './api';
import { Product, CreateProduct, PaginatedResponse, ApiResponse } from '@/types';

export const productService = {
  // Get all products with pagination
  getAll: async (page = 1, limit = 10, search = '', categoryId?: number): Promise<PaginatedResponse<Product>> => {
    const response = await api.get('/products', {
      params: { page, limit, search, categoryId },
    });
    return response.data;
  },

  // Get all products without pagination (for dropdowns)
  getAllForDropdown: async (): Promise<ApiResponse<Product[]>> => {
    const response = await api.get('/products/dropdown');
    return response.data;
  },

  // Get low stock products
  getLowStock: async (threshold = 10): Promise<ApiResponse<Product[]>> => {
    const response = await api.get('/products/low-stock', {
      params: { threshold },
    });
    return response.data;
  },

  // Get product by ID
  getById: async (id: number): Promise<ApiResponse<Product>> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get product by barcode
  getByBarcode: async (barcode: string): Promise<ApiResponse<Product>> => {
    const response = await api.get(`/products/barcode/${barcode}`);
    return response.data;
  },

  // Create new product
  create: async (productData: CreateProduct): Promise<ApiResponse<Product>> => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Update product
  update: async (id: number, productData: Partial<CreateProduct>): Promise<ApiResponse<Product>> => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Update stock
  updateStock: async (id: number, quantity: number, operation: 'add' | 'subtract'): Promise<ApiResponse<Product>> => {
    const response = await api.patch(`/products/${id}/stock`, { quantity, operation });
    return response.data;
  },

  // Delete product
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Bulk delete products
  bulkDelete: async (ids: number[]): Promise<ApiResponse<void>> => {
    const response = await api.post('/products/bulk-delete', { ids });
    return response.data;
  },
};