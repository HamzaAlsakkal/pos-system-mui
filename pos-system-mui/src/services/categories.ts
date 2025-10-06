import api from './api';
import { Category, CreateCategory, PaginatedResponse, ApiResponse } from '@/types';

// Mock categories data (since no backend)
const MOCK_CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Electronics',
    description: 'Electronic devices and accessories',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
  },
  {
    id: 2,
    name: 'Clothing',
    description: 'Apparel and fashion accessories',
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    name: 'Food & Beverages',
    description: 'Food items, snacks, and drinks',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    name: 'Books & Stationery',
    description: 'Books, notebooks, and office supplies',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    name: 'Health & Beauty',
    description: 'Personal care and cosmetic products',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 6,
    name: 'Home & Garden',
    description: 'Home improvement and gardening supplies',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 7,
    name: 'Sports & Fitness',
    description: 'Sports equipment and fitness accessories',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const categoryService = {
  // Get all categories with pagination (MOCK)
  getAll: async (page = 1, limit = 10, search = ''): Promise<PaginatedResponse<Category>> => {
    console.log('📁 Mock Categories: Getting all categories', { page, limit, search });
    await delay(400);
    
    let filteredCategories = MOCK_CATEGORIES;
    
    // Apply search filter
    if (search) {
      filteredCategories = MOCK_CATEGORIES.filter(category => 
        category.name.toLowerCase().includes(search.toLowerCase()) ||
        category.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCategories = filteredCategories.slice(startIndex, endIndex);
    
    return {
      data: paginatedCategories,
      total: filteredCategories.length,
      page: page,
      limit: limit,
      totalPages: Math.ceil(filteredCategories.length / limit),
    };
  },

  // Get all categories without pagination (for dropdowns) (MOCK)
  getAllForDropdown: async (): Promise<ApiResponse<Category[]>> => {
    console.log('📋 Mock Categories: Getting all for dropdown');
    await delay(200);
    
    return { 
      data: MOCK_CATEGORIES, 
      success: true 
    };
  },

  // Get category by ID (MOCK)
  getById: async (id: number): Promise<ApiResponse<Category>> => {
    console.log('📁 Mock Categories: Getting category by ID', id);
    await delay(300);
    
    const category = MOCK_CATEGORIES.find(c => c.id === id);
    if (!category) {
      throw new Error('Category not found');
    }
    
    return { data: category, success: true };
  },

  // Create new category (MOCK)
  create: async (categoryData: CreateCategory): Promise<ApiResponse<Category>> => {
    console.log('➕ Mock Categories: Creating category', categoryData.name);
    await delay(600);
    
    // Check for existing category
    const existingCategory = MOCK_CATEGORIES.find(c => 
      c.name.toLowerCase() === categoryData.name.toLowerCase()
    );
    
    if (existingCategory) {
      throw new Error('Category with this name already exists');
    }
    
    const newCategory: Category = {
      id: Math.max(...MOCK_CATEGORIES.map(c => c.id), 0) + 1,
      name: categoryData.name,
      description: categoryData.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    MOCK_CATEGORIES.push(newCategory);
    return { data: newCategory, success: true };
  },

  // Update category (MOCK)
  update: async (id: number, categoryData: Partial<CreateCategory>): Promise<ApiResponse<Category>> => {
    console.log('✏️ Mock Categories: Updating category', id);
    await delay(500);
    
    const categoryIndex = MOCK_CATEGORIES.findIndex(c => c.id === id);
    if (categoryIndex === -1) {
      throw new Error('Category not found');
    }
    
    // Check for duplicate name if name is being updated
    if (categoryData.name) {
      const existingCategory = MOCK_CATEGORIES.find(c => 
        c.id !== id && c.name.toLowerCase() === categoryData.name!.toLowerCase()
      );
      
      if (existingCategory) {
        throw new Error('Category with this name already exists');
      }
    }
    
    const updatedCategory = {
      ...MOCK_CATEGORIES[categoryIndex],
      ...categoryData,
      updatedAt: new Date().toISOString(),
    };
    
    MOCK_CATEGORIES[categoryIndex] = updatedCategory;
    return { data: updatedCategory, success: true };
  },

  // Delete category (MOCK)
  delete: async (id: number): Promise<ApiResponse<void>> => {
    console.log('🗑️ Mock Categories: Deleting category', id);
    await delay(400);
    
    const categoryIndex = MOCK_CATEGORIES.findIndex(c => c.id === id);
    if (categoryIndex === -1) {
      throw new Error('Category not found');
    }
    
    MOCK_CATEGORIES.splice(categoryIndex, 1);
    return { data: undefined, success: true };
  },

  // Bulk delete categories (MOCK)
  bulkDelete: async (ids: number[]): Promise<ApiResponse<void>> => {
    console.log('🗑️ Mock Categories: Bulk deleting categories', ids);
    await delay(600);
    
    ids.forEach(id => {
      const categoryIndex = MOCK_CATEGORIES.findIndex(c => c.id === id);
      if (categoryIndex !== -1) {
        MOCK_CATEGORIES.splice(categoryIndex, 1);
      }
    });
    
    return { data: undefined, success: true };
  },
};