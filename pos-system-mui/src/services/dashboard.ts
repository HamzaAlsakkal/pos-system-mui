import api from './api';
import { DashboardSummary } from '../types';

export const dashboardService = {
  // Get dashboard summary data
  getSummary: () => 
    api.get<DashboardSummary>('/dashboard/summary'),

  // Get low stock products
  getLowStockProducts: (limit?: number) =>
    api.get(`/dashboard/low-stock${limit ? `?limit=${limit}` : ''}`),
  
  // Get top selling products
  getTopProducts: (limit?: number) =>
    api.get(`/dashboard/top-products${limit ? `?limit=${limit}` : ''}`),
  
  // Get sales analytics
  getSalesAnalytics: (days?: number) =>
    api.get(`/dashboard/sales-analytics${days ? `?days=${days}` : ''}`)
};