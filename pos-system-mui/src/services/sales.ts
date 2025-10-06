import api from './api';
import { Sale, CreateSale, SaleItem, CreateSaleItem, PaginatedResponse, ApiResponse } from '@/types';

// Mock sales data (since no backend)
const MOCK_SALES: (Sale & { items: SaleItem[] })[] = [
  {
    id: 1,
    total: 1549.97,
    userId: 1,
    customerId: 1,
    paymentMethod: 'card',
    status: 'completed',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    user: { id: 1, fullName: 'Admin User', username: 'admin', email: 'admin@example.com', role: 'admin', createdAt: '', updatedAt: '' },
    customer: { id: 1, fullName: 'John Smith', phone: '+1-555-0101', email: 'john.smith@email.com', createdAt: '', updatedAt: '' },
    items: [
      {
        id: 1, saleId: 1, productId: 1, quantity: 1, unitPrice: 1299.99, total: 1299.99,
        createdAt: '', updatedAt: '',
        product: { id: 1, name: 'MacBook Pro 14"', barcode: 'MBP14001', categoryId: 1, price: 1299.99, stock: 8, createdAt: '', updatedAt: '' }
      },
      {
        id: 2, saleId: 1, productId: 8, quantity: 1, unitPrice: 249.98, total: 249.98,
        createdAt: '', updatedAt: '',
        product: { id: 8, name: 'Coffee Beans - Premium Blend', barcode: 'CFB001', categoryId: 3, price: 249.98, stock: 45, createdAt: '', updatedAt: '' }
      }
    ]
  },
  {
    id: 2,
    total: 89.97,
    userId: 2,
    customerId: 2,
    paymentMethod: 'cash',
    status: 'completed',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    user: { id: 2, fullName: 'Manager User', username: 'manager', email: 'manager@example.com', role: 'manager', createdAt: '', updatedAt: '' },
    customer: { id: 2, fullName: 'Emily Johnson', phone: '+1-555-0102', email: 'emily.johnson@email.com', createdAt: '', updatedAt: '' },
    items: [
      {
        id: 3, saleId: 2, productId: 5, quantity: 3, unitPrice: 29.99, total: 89.97,
        createdAt: '', updatedAt: '',
        product: { id: 5, name: 'Designer T-Shirt', barcode: 'DTS001', categoryId: 2, price: 29.99, stock: 25, createdAt: '', updatedAt: '' }
      }
    ]
  },
  {
    id: 3,
    total: 47.96,
    userId: 3,
    customerId: 3,
    paymentMethod: 'mobile',
    status: 'completed',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    user: { id: 3, fullName: 'Cashier User', username: 'cashier', email: 'cashier@example.com', role: 'cashier', createdAt: '', updatedAt: '' },
    customer: { id: 3, fullName: 'Michael Brown', phone: '+1-555-0103', email: 'michael.brown@email.com', createdAt: '', updatedAt: '' },
    items: [
      {
        id: 4, saleId: 3, productId: 10, quantity: 2, unitPrice: 15.99, total: 31.98,
        createdAt: '', updatedAt: '',
        product: { id: 10, name: 'Organic Snack Mix', barcode: 'OSM001', categoryId: 3, price: 15.99, stock: 78, createdAt: '', updatedAt: '' }
      },
      {
        id: 5, saleId: 3, productId: 14, quantity: 1, unitPrice: 15.98, total: 15.98,
        createdAt: '', updatedAt: '',
        product: { id: 14, name: 'Office Notebook Set', barcode: 'ONS001', categoryId: 4, price: 15.98, stock: 42, createdAt: '', updatedAt: '' }
      }
    ]
  },
  {
    id: 4,
    total: 199.99,
    userId: 1,
    customerId: 4,
    paymentMethod: 'card',
    status: 'completed',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    user: { id: 1, fullName: 'Admin User', username: 'admin', email: 'admin@example.com', role: 'admin', createdAt: '', updatedAt: '' },
    customer: { id: 4, fullName: 'Sarah Davis', phone: '+1-555-0104', email: 'sarah.davis@email.com', createdAt: '', updatedAt: '' },
    items: [
      {
        id: 6, saleId: 4, productId: 7, quantity: 1, unitPrice: 199.99, total: 199.99,
        createdAt: '', updatedAt: '',
        product: { id: 7, name: 'Smart Fitness Watch', barcode: 'SFW001', categoryId: 1, price: 199.99, stock: 18, createdAt: '', updatedAt: '' }
      }
    ]
  },
  {
    id: 5,
    total: 124.95,
    userId: 2,
    customerId: 5,
    paymentMethod: 'cash',
    status: 'completed',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    user: { id: 2, fullName: 'Manager User', username: 'manager', email: 'manager@example.com', role: 'manager', createdAt: '', updatedAt: '' },
    customer: { id: 5, fullName: 'David Wilson', phone: '+1-555-0105', email: 'david.wilson@email.com', createdAt: '', updatedAt: '' },
    items: [
      {
        id: 7, saleId: 5, productId: 11, quantity: 5, unitPrice: 24.99, total: 124.95,
        createdAt: '', updatedAt: '',
        product: { id: 11, name: 'Luxury Face Cream', barcode: 'LFC001', categoryId: 5, price: 24.99, stock: 33, createdAt: '', updatedAt: '' }
      }
    ]
  },
  {
    id: 6,
    total: 79.96,
    userId: 3,
    customerId: 6,
    paymentMethod: 'card',
    status: 'pending',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    user: { id: 3, fullName: 'Cashier User', username: 'cashier', email: 'cashier@example.com', role: 'cashier', createdAt: '', updatedAt: '' },
    customer: { id: 6, fullName: 'Jennifer Garcia', phone: '+1-555-0106', email: 'jennifer.garcia@email.com', createdAt: '', updatedAt: '' },
    items: [
      {
        id: 8, saleId: 6, productId: 13, quantity: 2, unitPrice: 39.98, total: 79.96,
        createdAt: '', updatedAt: '',
        product: { id: 13, name: 'Garden Tool Set', barcode: 'GTS001', categoryId: 6, price: 39.98, stock: 15, createdAt: '', updatedAt: '' }
      }
    ]
  },
  {
    id: 7,
    total: 149.97,
    userId: 1,
    customerId: 7,
    paymentMethod: 'mobile',
    status: 'completed',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    user: { id: 1, fullName: 'Admin User', username: 'admin', email: 'admin@example.com', role: 'admin', createdAt: '', updatedAt: '' },
    customer: { id: 7, fullName: 'Robert Martinez', phone: '+1-555-0107', email: 'robert.martinez@email.com', createdAt: '', updatedAt: '' },
    items: [
      {
        id: 9, saleId: 7, productId: 12, quantity: 3, unitPrice: 49.99, total: 149.97,
        createdAt: '', updatedAt: '',
        product: { id: 12, name: 'Basketball Shoes', barcode: 'BBS001', categoryId: 7, price: 49.99, stock: 22, createdAt: '', updatedAt: '' }
      }
    ]
  },
  {
    id: 8,
    total: 35.99,
    userId: 2,
    customerId: 8,
    paymentMethod: 'cash',
    status: 'cancelled',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    user: { id: 2, fullName: 'Manager User', username: 'manager', email: 'manager@example.com', role: 'manager', createdAt: '', updatedAt: '' },
    customer: { id: 8, fullName: 'Linda Anderson', phone: '+1-555-0108', email: 'linda.anderson@email.com', createdAt: '', updatedAt: '' },
    items: [
      {
        id: 10, saleId: 8, productId: 6, quantity: 1, unitPrice: 35.99, total: 35.99,
        createdAt: '', updatedAt: '',
        product: { id: 6, name: 'Fiction Novel - Bestseller', barcode: 'FNB001', categoryId: 4, price: 35.99, stock: 12, createdAt: '', updatedAt: '' }
      }
    ]
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const saleService = {
  // Get all sales with pagination (MOCK)
  getAll: async (page = 1, limit = 10, search = '', status?: string): Promise<PaginatedResponse<Sale>> => {
    console.log('💰 Mock Sales: Getting all sales', { page, limit, search, status });
    await delay(520);
    
    let filteredSales = MOCK_SALES.map(sale => ({
      id: sale.id,
      total: sale.total,
      userId: sale.userId,
      customerId: sale.customerId,
      paymentMethod: sale.paymentMethod,
      status: sale.status,
      createdAt: sale.createdAt,
      updatedAt: sale.updatedAt,
      user: sale.user,
      customer: sale.customer,
    })) as Sale[];
    
    // Apply status filter
    if (status && status !== 'all') {
      filteredSales = filteredSales.filter(sale => sale.status === status);
    }
    
    // Apply search filter
    if (search) {
      filteredSales = filteredSales.filter(sale => 
        sale.id.toString().includes(search) ||
        sale.customer?.fullName.toLowerCase().includes(search.toLowerCase()) ||
        sale.user?.fullName.toLowerCase().includes(search.toLowerCase()) ||
        sale.paymentMethod.toLowerCase().includes(search.toLowerCase()) ||
        sale.status.toLowerCase().includes(search.toLowerCase()) ||
        sale.total.toString().includes(search)
      );
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSales = filteredSales.slice(startIndex, endIndex);
    
    return {
      data: paginatedSales,
      total: filteredSales.length,
      page: page,
      limit: limit,
      totalPages: Math.ceil(filteredSales.length / limit),
    };
  },

  // Get recent sales (MOCK)
  getRecent: async (limit = 10): Promise<ApiResponse<Sale[]>> => {
    console.log('📊 Mock Sales: Getting recent sales', limit);
    await delay(380);
    
    const recentSales = MOCK_SALES
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)
      .map(sale => ({
        id: sale.id,
        total: sale.total,
        userId: sale.userId,
        customerId: sale.customerId,
        paymentMethod: sale.paymentMethod,
        status: sale.status,
        createdAt: sale.createdAt,
        updatedAt: sale.updatedAt,
        user: sale.user,
        customer: sale.customer,
      })) as Sale[];
    
    return { data: recentSales, success: true };
  },

  // Get sales by date range (MOCK)
  getByDateRange: async (startDate: string, endDate: string): Promise<ApiResponse<Sale[]>> => {
    console.log('📅 Mock Sales: Getting sales by date range', { startDate, endDate });
    await delay(450);
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const salesInRange = MOCK_SALES
      .filter(sale => {
        const saleDate = new Date(sale.createdAt);
        return saleDate >= start && saleDate <= end;
      })
      .map(sale => ({
        id: sale.id,
        total: sale.total,
        userId: sale.userId,
        customerId: sale.customerId,
        paymentMethod: sale.paymentMethod,
        status: sale.status,
        createdAt: sale.createdAt,
        updatedAt: sale.updatedAt,
        user: sale.user,
        customer: sale.customer,
      })) as Sale[];
    
    return { data: salesInRange, success: true };
  },

  // Get sale by ID with items (MOCK)
  getById: async (id: number): Promise<ApiResponse<Sale & { items: SaleItem[] }>> => {
    console.log('🔍 Mock Sales: Getting sale by ID', id);
    await delay(320);
    
    const sale = MOCK_SALES.find(s => s.id === id);
    if (!sale) {
      throw new Error('Sale not found');
    }
    
    return { data: sale, success: true };
  },

  // Create new sale with items (MOCK)
  create: async (saleData: CreateSale & { items: CreateSaleItem[] }): Promise<ApiResponse<Sale>> => {
    console.log('➕ Mock Sales: Creating sale', saleData);
    await delay(750);
    
    const newSale: Sale & { items: SaleItem[] } = {
      id: Math.max(...MOCK_SALES.map(s => s.id), 0) + 1,
      total: saleData.total,
      userId: saleData.userId,
      customerId: saleData.customerId,
      paymentMethod: saleData.paymentMethod,
      status: saleData.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: saleData.items.map((item, index) => ({
        id: Math.max(...MOCK_SALES.flatMap(s => s.items).map(i => i.id), 0) + index + 1,
        saleId: Math.max(...MOCK_SALES.map(s => s.id), 0) + 1,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }))
    };
    
    MOCK_SALES.push(newSale);
    
    // Return sale without items for the response
    const { items, ...saleResponse } = newSale;
    return { data: saleResponse as Sale, success: true };
  },

  // Update sale (MOCK)
  update: async (id: number, saleData: Partial<CreateSale>): Promise<ApiResponse<Sale>> => {
    console.log('✏️ Mock Sales: Updating sale', id);
    await delay(580);
    
    const saleIndex = MOCK_SALES.findIndex(s => s.id === id);
    if (saleIndex === -1) {
      throw new Error('Sale not found');
    }
    
    const updatedSale = {
      ...MOCK_SALES[saleIndex],
      ...saleData,
      updatedAt: new Date().toISOString(),
    };
    
    MOCK_SALES[saleIndex] = updatedSale;
    
    // Return sale without items for the response
    const { items, ...saleResponse } = updatedSale;
    return { data: saleResponse as Sale, success: true };
  },

  // Cancel sale (MOCK)
  cancel: async (id: number): Promise<ApiResponse<Sale>> => {
    console.log('❌ Mock Sales: Cancelling sale', id);
    await delay(420);
    
    const saleIndex = MOCK_SALES.findIndex(s => s.id === id);
    if (saleIndex === -1) {
      throw new Error('Sale not found');
    }
    
    if (MOCK_SALES[saleIndex].status === 'completed') {
      throw new Error('Cannot cancel a completed sale');
    }
    
    MOCK_SALES[saleIndex].status = 'cancelled';
    MOCK_SALES[saleIndex].updatedAt = new Date().toISOString();
    
    // Return sale without items for the response
    const { items, ...saleResponse } = MOCK_SALES[saleIndex];
    return { data: saleResponse as Sale, success: true };
  },

  // Complete sale (MOCK)
  complete: async (id: number): Promise<ApiResponse<Sale>> => {
    console.log('✅ Mock Sales: Completing sale', id);
    await delay(480);
    
    const saleIndex = MOCK_SALES.findIndex(s => s.id === id);
    if (saleIndex === -1) {
      throw new Error('Sale not found');
    }
    
    if (MOCK_SALES[saleIndex].status === 'cancelled') {
      throw new Error('Cannot complete a cancelled sale');
    }
    
    MOCK_SALES[saleIndex].status = 'completed';
    MOCK_SALES[saleIndex].updatedAt = new Date().toISOString();
    
    // Return sale without items for the response
    const { items, ...saleResponse } = MOCK_SALES[saleIndex];
    return { data: saleResponse as Sale, success: true };
  },

  // Delete sale (MOCK)
  delete: async (id: number): Promise<ApiResponse<void>> => {
    console.log('🗑️ Mock Sales: Deleting sale', id);
    await delay(420);
    
    const saleIndex = MOCK_SALES.findIndex(s => s.id === id);
    if (saleIndex === -1) {
      throw new Error('Sale not found');
    }
    
    MOCK_SALES.splice(saleIndex, 1);
    return { data: undefined, success: true };
  },

  // Get sales summary (MOCK)
  getSummary: async (period = 'month'): Promise<ApiResponse<{
    totalSales: number;
    totalAmount: number;
    averageAmount: number;
    topProducts: Array<{ product: string; quantity: number; revenue: number }>;
  }>> => {
    console.log('📈 Mock Sales: Getting sales summary', period);
    await delay(650);
    
    const completedSales = MOCK_SALES.filter(s => s.status === 'completed');
    const totalSales = completedSales.length;
    const totalAmount = completedSales.reduce((sum, sale) => sum + sale.total, 0);
    const averageAmount = totalSales > 0 ? totalAmount / totalSales : 0;
    
    // Calculate top products
    const productSales: Record<string, { quantity: number; revenue: number }> = {};
    
    completedSales.forEach(sale => {
      sale.items.forEach(item => {
        const productName = item.product?.name || `Product ${item.productId}`;
        if (!productSales[productName]) {
          productSales[productName] = { quantity: 0, revenue: 0 };
        }
        productSales[productName].quantity += item.quantity;
        productSales[productName].revenue += item.total;
      });
    });
    
    const topProducts = Object.entries(productSales)
      .map(([product, data]) => ({ product, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    
    return {
      data: {
        totalSales,
        totalAmount,
        averageAmount,
        topProducts,
      },
      success: true
    };
  },
};