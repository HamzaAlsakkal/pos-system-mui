import api from './api';
import { Supplier, CreateSupplier, PaginatedResponse, ApiResponse } from '@/types';

// Mock suppliers data (since no backend)
const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: 1,
    name: 'TechnoWorld Electronics',
    phone: '+1-555-2000',
    email: 'sales@technoworld.com',
    address: '123 Technology Blvd, San Francisco, CA 94105',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    name: 'Fashion Forward Inc.',
    phone: '+1-555-2100',
    email: 'orders@fashionforward.com',
    address: '456 Style Street, New York, NY 10001',
    createdAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    name: 'FreshFood Distributors',
    phone: '+1-555-2200',
    email: 'wholesale@freshfood.com',
    address: '789 Market Plaza, Chicago, IL 60601',
    createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    name: 'BookWise Publishers',
    phone: '+1-555-2300',
    email: 'sales@bookwise.com',
    address: '321 Literature Lane, Boston, MA 02101',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    name: 'Health & Beauty Supply Co.',
    phone: '+1-555-2400',
    email: 'orders@healthbeauty.com',
    address: '654 Wellness Way, Los Angeles, CA 90210',
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 6,
    name: 'Home & Garden Wholesale',
    phone: '+1-555-2500',
    email: 'bulk@homegarden.com',
    address: '987 Garden Grove, Seattle, WA 98101',
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 7,
    name: 'Sports Equipment Direct',
    phone: '+1-555-2600',
    email: 'wholesale@sportsdirect.com',
    address: '147 Athletic Ave, Denver, CO 80202',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 8,
    name: 'Premium Coffee Imports',
    phone: '+1-555-2700',
    email: 'sales@premiumcoffee.com',
    address: '258 Bean Boulevard, Portland, OR 97205',
    createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 9,
    name: 'Global Electronics Trading',
    phone: '+1-555-2800',
    email: 'info@globalelectronics.com',
    address: '369 Circuit City, Austin, TX 73301',
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 10,
    name: 'Organic Snacks Supplier',
    phone: '+1-555-2900',
    email: 'orders@organicsnacks.com',
    address: '741 Natural Foods Dr, Phoenix, AZ 85001',
    createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 11,
    name: 'Office Supplies Plus',
    phone: '+1-555-3000',
    email: 'bulk@officesupplies.com',
    address: '852 Business Park, Atlanta, GA 30301',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 12,
    name: 'Luxury Accessories Ltd.',
    phone: '+1-555-3100',
    email: 'wholesale@luxuryacc.com',
    address: '963 Fashion District, Miami, FL 33101',
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const supplierService = {
  // Get all suppliers with pagination (MOCK)
  getAll: async (page = 1, limit = 10, search = ''): Promise<PaginatedResponse<Supplier>> => {
    console.log('🏪 Mock Suppliers: Getting all suppliers', { page, limit, search });
    await delay(480);
    
    let filteredSuppliers = MOCK_SUPPLIERS;
    
    // Apply search filter
    if (search) {
      filteredSuppliers = MOCK_SUPPLIERS.filter(supplier => 
        supplier.name.toLowerCase().includes(search.toLowerCase()) ||
        supplier.email.toLowerCase().includes(search.toLowerCase()) ||
        supplier.phone.includes(search) ||
        supplier.address.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSuppliers = filteredSuppliers.slice(startIndex, endIndex);
    
    return {
      data: paginatedSuppliers,
      total: filteredSuppliers.length,
      page: page,
      limit: limit,
      totalPages: Math.ceil(filteredSuppliers.length / limit),
    };
  },

  // Get all suppliers without pagination (for dropdowns) (MOCK)
  getAllForDropdown: async (): Promise<ApiResponse<Supplier[]>> => {
    console.log('📋 Mock Suppliers: Getting all for dropdown');
    await delay(280);
    
    return { 
      data: MOCK_SUPPLIERS, 
      success: true 
    };
  },

  // Get supplier by ID (MOCK)
  getById: async (id: number): Promise<ApiResponse<Supplier>> => {
    console.log('🏪 Mock Suppliers: Getting supplier by ID', id);
    await delay(320);
    
    const supplier = MOCK_SUPPLIERS.find(s => s.id === id);
    if (!supplier) {
      throw new Error('Supplier not found');
    }
    
    return { data: supplier, success: true };
  },

  // Create new supplier (MOCK)
  create: async (supplierData: CreateSupplier): Promise<ApiResponse<Supplier>> => {
    console.log('➕ Mock Suppliers: Creating supplier', supplierData.name);
    await delay(700);
    
    // Check for existing supplier by name, email, or phone
    const existingSupplier = MOCK_SUPPLIERS.find(s => 
      s.name.toLowerCase() === supplierData.name.toLowerCase() ||
      s.email.toLowerCase() === supplierData.email.toLowerCase() ||
      s.phone === supplierData.phone
    );
    
    if (existingSupplier) {
      throw new Error('Supplier with this name, email, or phone number already exists');
    }
    
    const newSupplier: Supplier = {
      id: Math.max(...MOCK_SUPPLIERS.map(s => s.id), 0) + 1,
      name: supplierData.name,
      phone: supplierData.phone,
      email: supplierData.email,
      address: supplierData.address,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    MOCK_SUPPLIERS.push(newSupplier);
    return { data: newSupplier, success: true };
  },

  // Update supplier (MOCK)
  update: async (id: number, supplierData: Partial<CreateSupplier>): Promise<ApiResponse<Supplier>> => {
    console.log('✏️ Mock Suppliers: Updating supplier', id);
    await delay(580);
    
    const supplierIndex = MOCK_SUPPLIERS.findIndex(s => s.id === id);
    if (supplierIndex === -1) {
      throw new Error('Supplier not found');
    }
    
    // Check for duplicate name, email, or phone if being updated
    if (supplierData.name || supplierData.email || supplierData.phone) {
      const existingSupplier = MOCK_SUPPLIERS.find(s => 
        s.id !== id && (
          (supplierData.name && s.name.toLowerCase() === supplierData.name.toLowerCase()) ||
          (supplierData.email && s.email.toLowerCase() === supplierData.email.toLowerCase()) ||
          (supplierData.phone && s.phone === supplierData.phone)
        )
      );
      
      if (existingSupplier) {
        throw new Error('Supplier with this name, email, or phone number already exists');
      }
    }
    
    const updatedSupplier = {
      ...MOCK_SUPPLIERS[supplierIndex],
      ...supplierData,
      updatedAt: new Date().toISOString(),
    };
    
    MOCK_SUPPLIERS[supplierIndex] = updatedSupplier;
    return { data: updatedSupplier, success: true };
  },

  // Delete supplier (MOCK)
  delete: async (id: number): Promise<ApiResponse<void>> => {
    console.log('🗑️ Mock Suppliers: Deleting supplier', id);
    await delay(420);
    
    const supplierIndex = MOCK_SUPPLIERS.findIndex(s => s.id === id);
    if (supplierIndex === -1) {
      throw new Error('Supplier not found');
    }
    
    MOCK_SUPPLIERS.splice(supplierIndex, 1);
    return { data: undefined, success: true };
  },

  // Bulk delete suppliers (MOCK)
  bulkDelete: async (ids: number[]): Promise<ApiResponse<void>> => {
    console.log('🗑️ Mock Suppliers: Bulk deleting suppliers', ids);
    await delay(650);
    
    ids.forEach(id => {
      const supplierIndex = MOCK_SUPPLIERS.findIndex(s => s.id === id);
      if (supplierIndex !== -1) {
        MOCK_SUPPLIERS.splice(supplierIndex, 1);
      }
    });
    
    return { data: undefined, success: true };
  },
};