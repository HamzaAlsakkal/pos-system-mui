import api from './api';
import { Product, CreateProduct, PaginatedResponse, ApiResponse } from '@/types';

// Mock products data with varied stock levels and categories
const MOCK_PRODUCTS: Product[] = [
  // Electronics
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
  {
    id: 2,
    name: 'Samsung Galaxy S24',
    barcode: '123456789013',
    categoryId: 1,
    price: 849.99,
    stock: 18,
    createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    name: 'MacBook Air M3',
    barcode: '123456789014',
    categoryId: 1,
    price: 1299.99,
    stock: 12,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    name: 'AirPods Pro',
    barcode: '123456789015',
    categoryId: 1,
    price: 249.99,
    stock: 5, // Low stock
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },

  // Clothing
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
    id: 6,
    name: 'Levi\'s 501 Jeans',
    barcode: '234567890124',
    categoryId: 2,
    price: 69.99,
    stock: 30,
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 7,
    name: 'Adidas Hoodie',
    barcode: '234567890125',
    categoryId: 2,
    price: 79.99,
    stock: 8, // Low stock
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },

  // Food & Beverages
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
    id: 9,
    name: 'Organic Energy Bar',
    barcode: '345678901235',
    categoryId: 3,
    price: 2.49,
    stock: 75,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 10,
    name: 'Premium Coffee Beans',
    barcode: '345678901236',
    categoryId: 3,
    price: 14.99,
    stock: 3, // Very low stock
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Books & Stationery
  {
    id: 11,
    name: 'JavaScript Guide Book',
    barcode: '456789012345',
    categoryId: 4,
    price: 39.99,
    stock: 20,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 12,
    name: 'Moleskine Notebook',
    barcode: '456789012346',
    categoryId: 4,
    price: 24.99,
    stock: 35,
    createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 13,
    name: 'Parker Pen Set',
    barcode: '456789012347',
    categoryId: 4,
    price: 49.99,
    stock: 15,
    createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },

  // Health & Beauty
  {
    id: 14,
    name: 'Vitamin C Serum',
    barcode: '567890123456',
    categoryId: 5,
    price: 29.99,
    stock: 45,
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 15,
    name: 'Electric Toothbrush',
    barcode: '567890123457',
    categoryId: 5,
    price: 89.99,
    stock: 22,
    createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },

  // Sports & Fitness
  {
    id: 16,
    name: 'Yoga Mat Premium',
    barcode: '678901234567',
    categoryId: 7,
    price: 34.99,
    stock: 28,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 17,
    name: 'Protein Powder 2kg',
    barcode: '678901234568',
    categoryId: 7,
    price: 59.99,
    stock: 6, // Low stock
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
  // Get all products with pagination (MOCK)
  getAll: async (page = 1, limit = 10, search = '', categoryId?: number): Promise<PaginatedResponse<Product>> => {
    console.log('📦 Mock Products: Getting all products', { page, limit, search, categoryId });
    await delay(500);
    
    let filteredProducts = MOCK_PRODUCTS;
    
    // Apply category filter
    if (categoryId) {
      filteredProducts = filteredProducts.filter(product => product.categoryId === categoryId);
    }
    
    // Apply search filter
    if (search) {
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.barcode.includes(search)
      );
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    return {
      data: paginatedProducts,
      total: filteredProducts.length,
      page: page,
      limit: limit,
      totalPages: Math.ceil(filteredProducts.length / limit),
    };
  },

  // Get all products without pagination (for dropdowns) (MOCK)
  getAllForDropdown: async (): Promise<ApiResponse<Product[]>> => {
    console.log('📋 Mock Products: Getting all for dropdown');
    await delay(300);
    
    return { 
      data: MOCK_PRODUCTS, 
      success: true 
    };
  },

  // Get low stock products (MOCK)
  getLowStock: async (threshold = 10): Promise<ApiResponse<Product[]>> => {
    console.log('⚠️ Mock Products: Getting low stock products, threshold:', threshold);
    await delay(400);
    
    const lowStockProducts = MOCK_PRODUCTS.filter(product => product.stock <= threshold);
    
    return { 
      data: lowStockProducts, 
      success: true 
    };
  },

  // Get product by ID (MOCK)
  getById: async (id: number): Promise<ApiResponse<Product>> => {
    console.log('📦 Mock Products: Getting product by ID', id);
    await delay(300);
    
    const product = MOCK_PRODUCTS.find(p => p.id === id);
    if (!product) {
      throw new Error('Product not found');
    }
    
    return { data: product, success: true };
  },

  // Get product by barcode (MOCK)
  getByBarcode: async (barcode: string): Promise<ApiResponse<Product>> => {
    console.log('🔍 Mock Products: Getting product by barcode', barcode);
    await delay(350);
    
    const product = MOCK_PRODUCTS.find(p => p.barcode === barcode);
    if (!product) {
      throw new Error('Product not found');
    }
    
    return { data: product, success: true };
  },

  // Create new product (MOCK)
  create: async (productData: CreateProduct): Promise<ApiResponse<Product>> => {
    console.log('➕ Mock Products: Creating product', productData.name);
    await delay(700);
    
    // Check for existing product
    const existingProduct = MOCK_PRODUCTS.find(p => 
      p.name.toLowerCase() === productData.name.toLowerCase() ||
      p.barcode === productData.barcode
    );
    
    if (existingProduct) {
      throw new Error('Product with this name or barcode already exists');
    }
    
    const newProduct: Product = {
      id: Math.max(...MOCK_PRODUCTS.map(p => p.id), 0) + 1,
      name: productData.name,
      barcode: productData.barcode,
      categoryId: productData.categoryId,
      price: productData.price,
      stock: productData.stock,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    MOCK_PRODUCTS.push(newProduct);
    return { data: newProduct, success: true };
  },

  // Update product (MOCK)
  update: async (id: number, productData: Partial<CreateProduct>): Promise<ApiResponse<Product>> => {
    console.log('✏️ Mock Products: Updating product', id);
    await delay(600);
    
    const productIndex = MOCK_PRODUCTS.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }
    
    // Check for duplicate name or barcode if being updated
    if (productData.name || productData.barcode) {
      const existingProduct = MOCK_PRODUCTS.find(p => 
        p.id !== id && (
          (productData.name && p.name.toLowerCase() === productData.name.toLowerCase()) ||
          (productData.barcode && p.barcode === productData.barcode)
        )
      );
      
      if (existingProduct) {
        throw new Error('Product with this name or barcode already exists');
      }
    }
    
    const updatedProduct = {
      ...MOCK_PRODUCTS[productIndex],
      ...productData,
      updatedAt: new Date().toISOString(),
    };
    
    MOCK_PRODUCTS[productIndex] = updatedProduct;
    return { data: updatedProduct, success: true };
  },

  // Update stock (MOCK)
  updateStock: async (id: number, quantity: number, operation: 'add' | 'subtract'): Promise<ApiResponse<Product>> => {
    console.log('📊 Mock Products: Updating stock', { id, quantity, operation });
    await delay(400);
    
    const productIndex = MOCK_PRODUCTS.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }
    
    const product = MOCK_PRODUCTS[productIndex];
    const newStock = operation === 'add' 
      ? product.stock + quantity 
      : Math.max(0, product.stock - quantity);
    
    const updatedProduct = {
      ...product,
      stock: newStock,
      updatedAt: new Date().toISOString(),
    };
    
    MOCK_PRODUCTS[productIndex] = updatedProduct;
    return { data: updatedProduct, success: true };
  },

  // Delete product (MOCK)
  delete: async (id: number): Promise<ApiResponse<void>> => {
    console.log('🗑️ Mock Products: Deleting product', id);
    await delay(450);
    
    const productIndex = MOCK_PRODUCTS.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }
    
    MOCK_PRODUCTS.splice(productIndex, 1);
    return { data: undefined, success: true };
  },

  // Bulk delete products (MOCK)
  bulkDelete: async (ids: number[]): Promise<ApiResponse<void>> => {
    console.log('🗑️ Mock Products: Bulk deleting products', ids);
    await delay(650);
    
    ids.forEach(id => {
      const productIndex = MOCK_PRODUCTS.findIndex(p => p.id === id);
      if (productIndex !== -1) {
        MOCK_PRODUCTS.splice(productIndex, 1);
      }
    });
    
    return { data: undefined, success: true };
  },
};