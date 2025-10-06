import api from './api';
import { DashboardSummary, Product, Sale } from '../types';

// Mock dashboard data
const MOCK_DASHBOARD_DATA: DashboardSummary = {
  totalSales: 125420.50,
  totalPurchases: 85230.75,
  totalProducts: 17,
  lowStockProducts: 4,
  totalCustomers: 342,
  totalSuppliers: 28,
  recentSales: [
    {
      id: 1,
      total: 299.99,
      userId: 1,
      customerId: 1,
      paymentMethod: 'card',
      status: 'completed',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      total: 149.99,
      userId: 2,
      customerId: 2,
      paymentMethod: 'cash',
      status: 'completed',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      total: 89.99,
      userId: 1,
      customerId: 3,
      paymentMethod: 'mobile',
      status: 'completed',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
  ],
  topProducts: [
    {
      id: 8,
      name: 'Coca Cola 500ml',
      barcode: '345678901234',
      categoryId: 3,
      price: 1.99,
      stock: 150,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 5,
      name: 'Nike Air Force 1',
      barcode: '234567890123',
      categoryId: 2,
      price: 89.99,
      stock: 42,
      createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 1,
      name: 'iPhone 15 Pro',
      barcode: '123456789012',
      categoryId: 1,
      price: 999.99,
      stock: 25,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  salesTrend: {
    current: 125420.50,
    previous: 98750.25,
    percentage: 27.0,
  },
  purchasesTrend: {
    current: 85230.75,
    previous: 92100.50,
    percentage: -7.5,
  },
};

// Low stock products from the products service
const MOCK_LOW_STOCK_PRODUCTS: Product[] = [
  {
    id: 4,
    name: 'AirPods Pro',
    barcode: '123456789015',
    categoryId: 1,
    price: 249.99,
    stock: 5,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 7,
    name: 'Adidas Hoodie',
    barcode: '234567890125',
    categoryId: 2,
    price: 79.99,
    stock: 8,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 10,
    name: 'Premium Coffee Beans',
    barcode: '345678901236',
    categoryId: 3,
    price: 14.99,
    stock: 3,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 17,
    name: 'Protein Powder 2kg',
    barcode: '678901234568',
    categoryId: 7,
    price: 59.99,
    stock: 6,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const dashboardService = {
  // Get dashboard summary data (MOCK)
  getSummary: async () => {
    console.log('📊 Mock Dashboard: Getting summary data');
    await delay(600);
    
    return {
      data: MOCK_DASHBOARD_DATA
    };
  },

  // Get low stock products (MOCK)
  getLowStockProducts: async (limit?: number) => {
    console.log('⚠️ Mock Dashboard: Getting low stock products, limit:', limit);
    await delay(400);
    
    const products = limit ? MOCK_LOW_STOCK_PRODUCTS.slice(0, limit) : MOCK_LOW_STOCK_PRODUCTS;
    
    return {
      data: products
    };
  },

  // Get top selling products (MOCK)
  getTopProducts: async (limit?: number) => {
    console.log('🏆 Mock Dashboard: Getting top products, limit:', limit);
    await delay(450);
    
    const products = limit ? MOCK_DASHBOARD_DATA.topProducts.slice(0, limit) : MOCK_DASHBOARD_DATA.topProducts;
    
    return {
      data: products
    };
  },

  // Get sales analytics (MOCK)
  getSalesAnalytics: async (days?: number) => {
    console.log('📈 Mock Dashboard: Getting sales analytics, days:', days);
    await delay(500);
    
    // Generate mock sales data for the specified days
    const daysToAnalyze = days || 30;
    const salesData = [];
    
    for (let i = daysToAnalyze - 1; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const sales = Math.floor(Math.random() * 5000) + 1000; // Random sales between 1000-6000
      
      salesData.push({
        date: date.toISOString().split('T')[0],
        sales: sales,
        orders: Math.floor(sales / 150), // Approximate orders based on average order value
      });
    }
    
    return {
      data: {
        period: daysToAnalyze,
        totalSales: salesData.reduce((sum, day) => sum + day.sales, 0),
        totalOrders: salesData.reduce((sum, day) => sum + day.orders, 0),
        averageOrderValue: salesData.reduce((sum, day) => sum + day.sales, 0) / salesData.reduce((sum, day) => sum + day.orders, 0),
        dailyData: salesData,
      }
    };
  }
};