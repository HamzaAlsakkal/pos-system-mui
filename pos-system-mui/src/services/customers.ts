import api from './api';
import { Customer, CreateCustomer, PaginatedResponse, ApiResponse } from '@/types';

// Mock customers data (since no backend)
const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 1,
    fullName: 'John Smith',
    phone: '+1-555-0123',
    email: 'john.smith@email.com',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    fullName: 'Emily Johnson',
    phone: '+1-555-0234',
    email: 'emily.johnson@gmail.com',
    createdAt: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    fullName: 'Michael Brown',
    phone: '+1-555-0345',
    email: 'michael.brown@yahoo.com',
    createdAt: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    fullName: 'Sarah Davis',
    phone: '+1-555-0456',
    email: 'sarah.davis@outlook.com',
    createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    fullName: 'David Wilson',
    phone: '+1-555-0567',
    email: 'david.wilson@email.com',
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 6,
    fullName: 'Jessica Martinez',
    phone: '+1-555-0678',
    email: 'jessica.martinez@gmail.com',
    createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 7,
    fullName: 'Christopher Garcia',
    phone: '+1-555-0789',
    email: 'chris.garcia@hotmail.com',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 8,
    fullName: 'Amanda Rodriguez',
    phone: '+1-555-0890',
    email: 'amanda.rodriguez@email.com',
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 9,
    fullName: 'Matthew Lee',
    phone: '+1-555-0901',
    email: 'matthew.lee@yahoo.com',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 10,
    fullName: 'Ashley Taylor',
    phone: '+1-555-1012',
    email: 'ashley.taylor@gmail.com',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 11,
    fullName: 'Daniel Anderson',
    phone: '+1-555-1123',
    email: 'daniel.anderson@outlook.com',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 12,
    fullName: 'Lauren Thomas',
    phone: '+1-555-1234',
    email: 'lauren.thomas@email.com',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 13,
    fullName: 'Ryan Jackson',
    phone: '+1-555-1345',
    email: 'ryan.jackson@gmail.com',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 14,
    fullName: 'Nicole White',
    phone: '+1-555-1456',
    email: 'nicole.white@hotmail.com',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 15,
    fullName: 'Kevin Harris',
    phone: '+1-555-1567',
    email: 'kevin.harris@yahoo.com',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const customerService = {
  // Get all customers with pagination (MOCK)
  getAll: async (page = 1, limit = 10, search = ''): Promise<PaginatedResponse<Customer>> => {
    console.log('👥 Mock Customers: Getting all customers', { page, limit, search });
    await delay(450);
    
    let filteredCustomers = MOCK_CUSTOMERS;
    
    // Apply search filter
    if (search) {
      filteredCustomers = MOCK_CUSTOMERS.filter(customer => 
        customer.fullName.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase()) ||
        customer.phone.includes(search)
      );
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);
    
    return {
      data: paginatedCustomers,
      total: filteredCustomers.length,
      page: page,
      limit: limit,
      totalPages: Math.ceil(filteredCustomers.length / limit),
    };
  },

  // Get all customers without pagination (for dropdowns) (MOCK)
  getAllForDropdown: async (): Promise<ApiResponse<Customer[]>> => {
    console.log('📋 Mock Customers: Getting all for dropdown');
    await delay(250);
    
    return { 
      data: MOCK_CUSTOMERS, 
      success: true 
    };
  },

  // Get customer by ID (MOCK)
  getById: async (id: number): Promise<ApiResponse<Customer>> => {
    console.log('👤 Mock Customers: Getting customer by ID', id);
    await delay(300);
    
    const customer = MOCK_CUSTOMERS.find(c => c.id === id);
    if (!customer) {
      throw new Error('Customer not found');
    }
    
    return { data: customer, success: true };
  },

  // Create new customer (MOCK)
  create: async (customerData: CreateCustomer): Promise<ApiResponse<Customer>> => {
    console.log('➕ Mock Customers: Creating customer', customerData.fullName);
    await delay(650);
    
    // Check for existing customer by email or phone
    const existingCustomer = MOCK_CUSTOMERS.find(c => 
      c.email.toLowerCase() === customerData.email.toLowerCase() ||
      c.phone === customerData.phone
    );
    
    if (existingCustomer) {
      throw new Error('Customer with this email or phone number already exists');
    }
    
    const newCustomer: Customer = {
      id: Math.max(...MOCK_CUSTOMERS.map(c => c.id), 0) + 1,
      fullName: customerData.fullName,
      phone: customerData.phone,
      email: customerData.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    MOCK_CUSTOMERS.push(newCustomer);
    return { data: newCustomer, success: true };
  },

  // Update customer (MOCK)
  update: async (id: number, customerData: Partial<CreateCustomer>): Promise<ApiResponse<Customer>> => {
    console.log('✏️ Mock Customers: Updating customer', id);
    await delay(550);
    
    const customerIndex = MOCK_CUSTOMERS.findIndex(c => c.id === id);
    if (customerIndex === -1) {
      throw new Error('Customer not found');
    }
    
    // Check for duplicate email or phone if being updated
    if (customerData.email || customerData.phone) {
      const existingCustomer = MOCK_CUSTOMERS.find(c => 
        c.id !== id && (
          (customerData.email && c.email.toLowerCase() === customerData.email.toLowerCase()) ||
          (customerData.phone && c.phone === customerData.phone)
        )
      );
      
      if (existingCustomer) {
        throw new Error('Customer with this email or phone number already exists');
      }
    }
    
    const updatedCustomer = {
      ...MOCK_CUSTOMERS[customerIndex],
      ...customerData,
      updatedAt: new Date().toISOString(),
    };
    
    MOCK_CUSTOMERS[customerIndex] = updatedCustomer;
    return { data: updatedCustomer, success: true };
  },

  // Delete customer (MOCK)
  delete: async (id: number): Promise<ApiResponse<void>> => {
    console.log('🗑️ Mock Customers: Deleting customer', id);
    await delay(400);
    
    const customerIndex = MOCK_CUSTOMERS.findIndex(c => c.id === id);
    if (customerIndex === -1) {
      throw new Error('Customer not found');
    }
    
    MOCK_CUSTOMERS.splice(customerIndex, 1);
    return { data: undefined, success: true };
  },

  // Bulk delete customers (MOCK)
  bulkDelete: async (ids: number[]): Promise<ApiResponse<void>> => {
    console.log('🗑️ Mock Customers: Bulk deleting customers', ids);
    await delay(600);
    
    ids.forEach(id => {
      const customerIndex = MOCK_CUSTOMERS.findIndex(c => c.id === id);
      if (customerIndex !== -1) {
        MOCK_CUSTOMERS.splice(customerIndex, 1);
      }
    });
    
    return { data: undefined, success: true };
  },

  // Export customers to CSV
  exportToCSV: async (customerIds?: number[]): Promise<Blob> => {
    console.log('📤 Mock Customers: Exporting to CSV', customerIds?.length ? `${customerIds.length} selected` : 'all customers');
    await delay(300);
    
    let customersToExport = MOCK_CUSTOMERS;
    
    // Filter by IDs if provided
    if (customerIds && customerIds.length > 0) {
      customersToExport = MOCK_CUSTOMERS.filter(customer => 
        customerIds.includes(customer.id)
      );
    }
    
    // Create CSV content
    const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Created Date', 'Last Updated'];
    const csvContent = [
      headers.join(','),
      ...customersToExport.map(customer => [
        customer.id,
        `"${customer.fullName}"`,
        `"${customer.email}"`,
        `"${customer.phone}"`,
        new Date(customer.createdAt).toLocaleDateString(),
        new Date(customer.updatedAt).toLocaleDateString()
      ].join(','))
    ].join('\n');
    
    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  },
};