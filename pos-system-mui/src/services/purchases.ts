import api from './api';
import { Purchase, CreatePurchase, PurchaseItem, CreatePurchaseItem, PaginatedResponse, ApiResponse } from '@/types';

// Mock purchases data (since no backend)
const MOCK_PURCHASES: (Purchase & { items: PurchaseItem[] })[] = [
  {
    id: 1,
    total: 12999.50,
    supplierId: 1,
    userId: 1,
    status: 'completed',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    supplier: { id: 1, name: 'TechnoWorld Electronics', phone: '+1-555-2000', email: 'sales@technoworld.com', address: '123 Technology Blvd, San Francisco, CA 94105', createdAt: '', updatedAt: '' },
    user: { id: 1, fullName: 'Admin User', username: 'admin', email: 'admin@example.com', role: 'admin', createdAt: '', updatedAt: '' },
    items: [
      {
        id: 1, purchaseId: 1, productId: 1, quantity: 10, unitCost: 1299.95, total: 12999.50,
        createdAt: '', updatedAt: '',
        product: { id: 1, name: 'MacBook Pro 14"', barcode: 'MBP14001', categoryId: 1, price: 1299.99, stock: 8, createdAt: '', updatedAt: '' }
      }
    ]
  },
  {
    id: 2,
    total: 1499.40,
    supplierId: 2,
    userId: 2,
    status: 'completed',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    supplier: { id: 2, name: 'Fashion Forward Inc.', phone: '+1-555-2100', email: 'orders@fashionforward.com', address: '456 Style Street, New York, NY 10001', createdAt: '', updatedAt: '' },
    user: { id: 2, fullName: 'Manager User', username: 'manager', email: 'manager@example.com', role: 'manager', createdAt: '', updatedAt: '' },
    items: [
      {
        id: 2, purchaseId: 2, productId: 5, quantity: 50, unitCost: 29.99, total: 1499.50,
        createdAt: '', updatedAt: '',
        product: { id: 5, name: 'Designer T-Shirt', barcode: 'DTS001', categoryId: 2, price: 29.99, stock: 25, createdAt: '', updatedAt: '' }
      }
    ]
  },
  {
    id: 3,
    total: 2499.75,
    supplierId: 8,
    userId: 1,
    status: 'completed',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    supplier: { id: 8, name: 'Premium Coffee Imports', phone: '+1-555-2700', email: 'sales@premiumcoffee.com', address: '258 Bean Boulevard, Portland, OR 97205', createdAt: '', updatedAt: '' },
    user: { id: 1, fullName: 'Admin User', username: 'admin', email: 'admin@example.com', role: 'admin', createdAt: '', updatedAt: '' },
    items: [
      {
        id: 3, purchaseId: 3, productId: 8, quantity: 100, unitCost: 24.99, total: 2499.00,
        createdAt: '', updatedAt: '',
        product: { id: 8, name: 'Coffee Beans - Premium Blend', barcode: 'CFB001', categoryId: 3, price: 249.98, stock: 45, createdAt: '', updatedAt: '' }
      }
    ]
  },
  {
    id: 4,
    total: 1999.20,
    supplierId: 9,
    userId: 2,
    status: 'completed',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    supplier: { id: 9, name: 'Global Electronics Trading', phone: '+1-555-2800', email: 'info@globalelectronics.com', address: '369 Circuit City, Austin, TX 73301', createdAt: '', updatedAt: '' },
    user: { id: 2, fullName: 'Manager User', username: 'manager', email: 'manager@example.com', role: 'manager', createdAt: '', updatedAt: '' },
    items: [
      {
        id: 4, purchaseId: 4, productId: 7, quantity: 10, unitCost: 199.92, total: 1999.20,
        createdAt: '', updatedAt: '',
        product: { id: 7, name: 'Smart Fitness Watch', barcode: 'SFW001', categoryId: 1, price: 199.99, stock: 18, createdAt: '', updatedAt: '' }
      }
    ]
  },
  {
    id: 5,
    total: 799.50,
    supplierId: 10,
    userId: 1,
    status: 'completed',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
    updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    supplier: { id: 10, name: 'Organic Snacks Supplier', phone: '+1-555-2900', email: 'orders@organicsnacks.com', address: '741 Natural Foods Dr, Phoenix, AZ 85001', createdAt: '', updatedAt: '' },
    user: { id: 1, fullName: 'Admin User', username: 'admin', email: 'admin@example.com', role: 'admin', createdAt: '', updatedAt: '' },
    items: [
      {
        id: 5, purchaseId: 5, productId: 10, quantity: 50, unitCost: 15.99, total: 799.50,
        createdAt: '', updatedAt: '',
        product: { id: 10, name: 'Organic Snack Mix', barcode: 'OSM001', categoryId: 3, price: 15.99, stock: 78, createdAt: '', updatedAt: '' }
      }
    ]
  },
  {
    id: 6,
    total: 1249.75,
    supplierId: 5,
    userId: 2,
    status: 'completed',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    supplier: { id: 5, name: 'Health & Beauty Supply Co.', phone: '+1-555-2400', email: 'orders@healthbeauty.com', address: '654 Wellness Way, Los Angeles, CA 90210', createdAt: '', updatedAt: '' },
    user: { id: 2, fullName: 'Manager User', username: 'manager', email: 'manager@example.com', role: 'manager', createdAt: '', updatedAt: '' },
    items: [
      {
        id: 6, purchaseId: 6, productId: 11, quantity: 50, unitCost: 24.99, total: 1249.50,
        createdAt: '', updatedAt: '',
        product: { id: 11, name: 'Luxury Face Cream', barcode: 'LFC001', categoryId: 5, price: 24.99, stock: 33, createdAt: '', updatedAt: '' }
      }
    ]
  },
  {
    id: 7,
    total: 1999.50,
    supplierId: 6,
    userId: 1,
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    supplier: { id: 6, name: 'Home & Garden Wholesale', phone: '+1-555-2500', email: 'bulk@homegarden.com', address: '987 Garden Grove, Seattle, WA 98101', createdAt: '', updatedAt: '' },
    user: { id: 1, fullName: 'Admin User', username: 'admin', email: 'admin@example.com', role: 'admin', createdAt: '', updatedAt: '' },
    items: [
      {
        id: 7, purchaseId: 7, productId: 13, quantity: 50, unitCost: 39.99, total: 1999.50,
        createdAt: '', updatedAt: '',
        product: { id: 13, name: 'Garden Tool Set', barcode: 'GTS001', categoryId: 6, price: 39.98, stock: 15, createdAt: '', updatedAt: '' }
      }
    ]
  },
  {
    id: 8,
    total: 1499.75,
    supplierId: 7,
    userId: 2,
    status: 'pending',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    supplier: { id: 7, name: 'Sports Equipment Direct', phone: '+1-555-2600', email: 'wholesale@sportsdirect.com', address: '147 Athletic Ave, Denver, CO 80202', createdAt: '', updatedAt: '' },
    user: { id: 2, fullName: 'Manager User', username: 'manager', email: 'manager@example.com', role: 'manager', createdAt: '', updatedAt: '' },
    items: [
      {
        id: 8, purchaseId: 8, productId: 12, quantity: 30, unitCost: 49.99, total: 1499.70,
        createdAt: '', updatedAt: '',
        product: { id: 12, name: 'Basketball Shoes', barcode: 'BBS001', categoryId: 7, price: 49.99, stock: 22, createdAt: '', updatedAt: '' }
      }
    ]
  },
  {
    id: 9,
    total: 719.50,
    supplierId: 4,
    userId: 1,
    status: 'cancelled',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
    updatedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    supplier: { id: 4, name: 'BookWise Publishers', phone: '+1-555-2300', email: 'sales@bookwise.com', address: '321 Literature Lane, Boston, MA 02101', createdAt: '', updatedAt: '' },
    user: { id: 1, fullName: 'Admin User', username: 'admin', email: 'admin@example.com', role: 'admin', createdAt: '', updatedAt: '' },
    items: [
      {
        id: 9, purchaseId: 9, productId: 6, quantity: 20, unitCost: 35.99, total: 719.80,
        createdAt: '', updatedAt: '',
        product: { id: 6, name: 'Fiction Novel - Bestseller', barcode: 'FNB001', categoryId: 4, price: 35.99, stock: 12, createdAt: '', updatedAt: '' }
      }
    ]
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const purchaseService = {
  // Get all purchases with pagination (MOCK)
  getAll: async (page = 1, limit = 10, search = '', status?: string): Promise<PaginatedResponse<Purchase>> => {
    console.log('🛒 Mock Purchases: Getting all purchases', { page, limit, search, status });
    await delay(550);
    
    let filteredPurchases = MOCK_PURCHASES.map(purchase => ({
      id: purchase.id,
      total: purchase.total,
      supplierId: purchase.supplierId,
      userId: purchase.userId,
      status: purchase.status,
      createdAt: purchase.createdAt,
      updatedAt: purchase.updatedAt,
      supplier: purchase.supplier,
      user: purchase.user,
    })) as Purchase[];
    
    // Apply status filter
    if (status && status !== 'all') {
      filteredPurchases = filteredPurchases.filter(purchase => purchase.status === status);
    }
    
    // Apply search filter
    if (search) {
      filteredPurchases = filteredPurchases.filter(purchase => 
        purchase.id.toString().includes(search) ||
        purchase.supplier?.name.toLowerCase().includes(search.toLowerCase()) ||
        purchase.user?.fullName.toLowerCase().includes(search.toLowerCase()) ||
        purchase.status.toLowerCase().includes(search.toLowerCase()) ||
        purchase.total.toString().includes(search)
      );
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPurchases = filteredPurchases.slice(startIndex, endIndex);
    
    return {
      data: paginatedPurchases,
      total: filteredPurchases.length,
      page: page,
      limit: limit,
      totalPages: Math.ceil(filteredPurchases.length / limit),
    };
  },

  // Get recent purchases (MOCK)
  getRecent: async (limit = 10): Promise<ApiResponse<Purchase[]>> => {
    console.log('📊 Mock Purchases: Getting recent purchases', limit);
    await delay(380);
    
    const recentPurchases = MOCK_PURCHASES
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)
      .map(purchase => ({
        id: purchase.id,
        total: purchase.total,
        supplierId: purchase.supplierId,
        userId: purchase.userId,
        status: purchase.status,
        createdAt: purchase.createdAt,
        updatedAt: purchase.updatedAt,
        supplier: purchase.supplier,
        user: purchase.user,
      })) as Purchase[];
    
    return { data: recentPurchases, success: true };
  },

  // Get purchases by date range (MOCK)
  getByDateRange: async (startDate: string, endDate: string): Promise<ApiResponse<Purchase[]>> => {
    console.log('📅 Mock Purchases: Getting purchases by date range', { startDate, endDate });
    await delay(450);
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const purchasesInRange = MOCK_PURCHASES
      .filter(purchase => {
        const purchaseDate = new Date(purchase.createdAt);
        return purchaseDate >= start && purchaseDate <= end;
      })
      .map(purchase => ({
        id: purchase.id,
        total: purchase.total,
        supplierId: purchase.supplierId,
        userId: purchase.userId,
        status: purchase.status,
        createdAt: purchase.createdAt,
        updatedAt: purchase.updatedAt,
        supplier: purchase.supplier,
        user: purchase.user,
      })) as Purchase[];
    
    return { data: purchasesInRange, success: true };
  },

  // Get purchase by ID with items (MOCK)
  getById: async (id: number): Promise<ApiResponse<Purchase & { items: PurchaseItem[] }>> => {
    console.log('🔍 Mock Purchases: Getting purchase by ID', id);
    await delay(320);
    
    const purchase = MOCK_PURCHASES.find(p => p.id === id);
    if (!purchase) {
      throw new Error('Purchase not found');
    }
    
    return { data: purchase, success: true };
  },

  // Create new purchase with items (MOCK)
  create: async (purchaseData: CreatePurchase & { items: CreatePurchaseItem[] }): Promise<ApiResponse<Purchase>> => {
    console.log('➕ Mock Purchases: Creating purchase', purchaseData);
    await delay(750);
    
    const newPurchase: Purchase & { items: PurchaseItem[] } = {
      id: Math.max(...MOCK_PURCHASES.map(p => p.id), 0) + 1,
      total: purchaseData.total,
      supplierId: purchaseData.supplierId,
      userId: purchaseData.userId,
      status: purchaseData.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: purchaseData.items.map((item, index) => ({
        id: Math.max(...MOCK_PURCHASES.flatMap(p => p.items).map(i => i.id), 0) + index + 1,
        purchaseId: Math.max(...MOCK_PURCHASES.map(p => p.id), 0) + 1,
        productId: item.productId,
        quantity: item.quantity,
        unitCost: item.unitCost,
        total: item.total,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }))
    };
    
    MOCK_PURCHASES.push(newPurchase);
    
    // Return purchase without items for the response
    const { items, ...purchaseResponse } = newPurchase;
    return { data: purchaseResponse as Purchase, success: true };
  },

  // Update purchase (MOCK)
  update: async (id: number, purchaseData: Partial<CreatePurchase>): Promise<ApiResponse<Purchase>> => {
    console.log('✏️ Mock Purchases: Updating purchase', id);
    await delay(580);
    
    const purchaseIndex = MOCK_PURCHASES.findIndex(p => p.id === id);
    if (purchaseIndex === -1) {
      throw new Error('Purchase not found');
    }
    
    const updatedPurchase = {
      ...MOCK_PURCHASES[purchaseIndex],
      ...purchaseData,
      updatedAt: new Date().toISOString(),
    };
    
    MOCK_PURCHASES[purchaseIndex] = updatedPurchase;
    
    // Return purchase without items for the response
    const { items, ...purchaseResponse } = updatedPurchase;
    return { data: purchaseResponse as Purchase, success: true };
  },

  // Cancel purchase (MOCK)
  cancel: async (id: number): Promise<ApiResponse<Purchase>> => {
    console.log('❌ Mock Purchases: Cancelling purchase', id);
    await delay(420);
    
    const purchaseIndex = MOCK_PURCHASES.findIndex(p => p.id === id);
    if (purchaseIndex === -1) {
      throw new Error('Purchase not found');
    }
    
    if (MOCK_PURCHASES[purchaseIndex].status === 'completed') {
      throw new Error('Cannot cancel a completed purchase');
    }
    
    MOCK_PURCHASES[purchaseIndex].status = 'cancelled';
    MOCK_PURCHASES[purchaseIndex].updatedAt = new Date().toISOString();
    
    // Return purchase without items for the response
    const { items, ...purchaseResponse } = MOCK_PURCHASES[purchaseIndex];
    return { data: purchaseResponse as Purchase, success: true };
  },

  // Complete purchase (MOCK)
  complete: async (id: number): Promise<ApiResponse<Purchase>> => {
    console.log('✅ Mock Purchases: Completing purchase', id);
    await delay(480);
    
    const purchaseIndex = MOCK_PURCHASES.findIndex(p => p.id === id);
    if (purchaseIndex === -1) {
      throw new Error('Purchase not found');
    }
    
    if (MOCK_PURCHASES[purchaseIndex].status === 'cancelled') {
      throw new Error('Cannot complete a cancelled purchase');
    }
    
    MOCK_PURCHASES[purchaseIndex].status = 'completed';
    MOCK_PURCHASES[purchaseIndex].updatedAt = new Date().toISOString();
    
    // Return purchase without items for the response
    const { items, ...purchaseResponse } = MOCK_PURCHASES[purchaseIndex];
    return { data: purchaseResponse as Purchase, success: true };
  },

  // Delete purchase (MOCK)
  delete: async (id: number): Promise<ApiResponse<void>> => {
    console.log('🗑️ Mock Purchases: Deleting purchase', id);
    await delay(420);
    
    const purchaseIndex = MOCK_PURCHASES.findIndex(p => p.id === id);
    if (purchaseIndex === -1) {
      throw new Error('Purchase not found');
    }
    
    MOCK_PURCHASES.splice(purchaseIndex, 1);
    return { data: undefined, success: true };
  },

  // Get purchases summary (MOCK)
  getSummary: async (period = 'month'): Promise<ApiResponse<{
    totalPurchases: number;
    totalAmount: number;
    averageAmount: number;
    topSuppliers: Array<{ supplier: string; orders: number; amount: number }>;
  }>> => {
    console.log('📈 Mock Purchases: Getting purchases summary', period);
    await delay(650);
    
    const completedPurchases = MOCK_PURCHASES.filter(p => p.status === 'completed');
    const totalPurchases = completedPurchases.length;
    const totalAmount = completedPurchases.reduce((sum, purchase) => sum + purchase.total, 0);
    const averageAmount = totalPurchases > 0 ? totalAmount / totalPurchases : 0;
    
    // Calculate top suppliers
    const supplierStats: Record<string, { orders: number; amount: number }> = {};
    
    completedPurchases.forEach(purchase => {
      const supplierName = purchase.supplier?.name || `Supplier ${purchase.supplierId}`;
      if (!supplierStats[supplierName]) {
        supplierStats[supplierName] = { orders: 0, amount: 0 };
      }
      supplierStats[supplierName].orders += 1;
      supplierStats[supplierName].amount += purchase.total;
    });
    
    const topSuppliers = Object.entries(supplierStats)
      .map(([supplier, data]) => ({ supplier, ...data }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
    
    return {
      data: {
        totalPurchases,
        totalAmount,
        averageAmount,
        topSuppliers,
      },
      success: true
    };
  },
};