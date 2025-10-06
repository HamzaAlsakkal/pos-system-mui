# POS System - Backend API Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Database Schema](#database-schema)
4. [Authentication & Authorization](#authentication--authorization)
5. [API Endpoints](#api-endpoints)
6. [Data Models](#data-models)
7. [Business Logic](#business-logic)
8. [Frontend Integration Guide](#frontend-integration-guide)

---

## Project Overview

This is a comprehensive **Point of Sale (POS) System** backend built with NestJS, TypeORM, and PostgreSQL. The system manages:
- **User Management** with role-based access control (Admin, Manager, Cashier)
- **Product & Inventory Management**
- **Sales Transactions** with multiple payment methods
- **Purchase Orders** from suppliers
- **Customer & Supplier Management**
- **Category Management** for products

### Key Features
- JWT-based authentication
- Role-based authorization (RBAC)
- Automatic stock management
- Transaction tracking (Sales & Purchases)
- Comprehensive CRUD operations
- PostgreSQL database with TypeORM

---

## Technology Stack

### Core Technologies
- **Framework**: NestJS v11.1.6
- **Database**: PostgreSQL
- **ORM**: TypeORM v0.3.27
- **Authentication**: JWT (Passport-JWT)
- **Password Hashing**: Bcrypt v6.0.0
- **Validation**: class-validator & class-transformer
- **Language**: TypeScript v5.7.3

### Development Tools
- **Testing**: Jest
- **Linting**: ESLint with Prettier
- **API Documentation**: Built-in NestJS features

### Server Configuration
- **Default Port**: 3000
- **Database**: PostgreSQL
- **Environment Variables**: .env file (dotenv)

---

## Database Schema

### Entity Relationship Diagram (ERD)

```
Users (1) ──────< (N) Sales
Users (1) ──────< (N) Purchases

Customers (1) ──< (N) Sales

Suppliers (1) ──< (N) Purchases

Categories (1) ─< (N) Products

Products (1) ───< (N) SalesItems
Products (1) ───< (N) PurchaseItems

Sales (1) ──────< (N) SalesItems

Purchases (1) ──< (N) PurchaseItems
```

### Database Tables

#### 1. **users**
Stores system users (Admin, Manager, Cashier)
- Primary Key: `id` (auto-increment)
- Unique Fields: `username`, `email`
- Relations: One-to-Many with Sales and Purchases

#### 2. **customers**
Stores customer information
- Primary Key: `id` (auto-increment)
- Unique Fields: `phone`, `email` (nullable)
- Relations: One-to-Many with Sales

#### 3. **suppliers**
Stores supplier information
- Primary Key: `id` (auto-increment)
- Unique Fields: `phone`, `email`
- Relations: One-to-Many with Purchases

#### 4. **categories**
Product categories
- Primary Key: `id` (auto-increment)
- Unique Fields: `name`
- Relations: One-to-Many with Products

#### 5. **products**
Product inventory
- Primary Key: `id` (auto-increment)
- Unique Fields: `name`, `barcode`
- Foreign Keys: `categoryId` → categories.id
- Relations: Many-to-One with Category, One-to-Many with SalesItems and PurchaseItems

#### 6. **sales**
Sales transactions
- Primary Key: `id` (auto-increment)
- Foreign Keys: `userId` → users.id, `customerId` → customers.id
- Relations: Many-to-One with User and Customer, One-to-Many with SalesItems

#### 7. **sales_items**
Line items for each sale
- Primary Key: `id` (auto-increment)
- Foreign Keys: `saleId` → sales.id, `productId` → products.id
- Unique Constraint: (`saleId`, `productId`)
- Relations: Many-to-One with Sale and Product

#### 8. **purchases**
Purchase orders from suppliers
- Primary Key: `id` (auto-increment)
- Foreign Keys: `supplierId` → suppliers.id, `userId` → users.id
- Relations: Many-to-One with Supplier and User, One-to-Many with PurchaseItems

#### 9. **purchase_items**
Line items for each purchase
- Primary Key: `id` (auto-increment)
- Foreign Keys: `purchaseId` → purchases.id, `productId` → products.id
- Unique Constraint: (`purchaseId`, `productId`)
- Relations: Many-to-One with Purchase and Product

---

## Authentication & Authorization

### User Roles
```typescript
enum UserRole {
  ADMIN = 'admin',      // Full system access
  CASHIER = 'cashier',  // Limited to sales operations
  MANAGER = 'manager',  // Extended access (can manage suppliers, purchases)
}
```

### Authentication Flow

1. **Registration** (`POST /auth/register`)
   - Creates new user account
   - Password is hashed with bcrypt
   - Default role: CASHIER
   - Returns user data (password excluded)

2. **Login** (`POST /auth/login`)
   - Validates email and password
   - Returns JWT access token
   - Token payload includes: `userId`, `email`, `role`

3. **Protected Routes**
   - Use `@UseGuards(JwtAuthGuard)` decorator
   - JWT token required in Authorization header: `Bearer <token>`
   - Token validation via Passport JWT strategy

4. **Role-Based Access**
   - Use `@UseGuards(JwtAuthGuard, RolesGuard)` decorator
   - Specify allowed roles with `@Roles(UserRole.ADMIN)` decorator
   - Example: Only ADMIN can access user management endpoints

### Protected Endpoints Summary

| Endpoint Pattern | Roles Required | Guard |
|-----------------|----------------|-------|
| `/auth/change-password` | Any authenticated user | JwtAuthGuard |
| `/users/*` | ADMIN | JwtAuthGuard + RolesGuard |
| `/suppliers/*` | ADMIN, MANAGER | JwtAuthGuard + RolesGuard |
| Other endpoints | No authentication (⚠️ Consider securing) | None |

---

## API Endpoints

### Base URL
```
http://localhost:3000
```

---

### 🔐 Authentication Endpoints

#### 1. Register User
```http
POST /auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "role": "cashier" // optional, default: cashier
}
```

**Response:**
```json
{
  "id": 1,
  "fullName": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "role": "cashier",
  "createdAt": "2025-10-03T10:00:00.000Z",
  "updatedAt": "2025-10-03T10:00:00.000Z"
}
```

#### 2. Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "role": "cashier"
  }
}
```

#### 3. Change Password (Protected)
```http
PATCH /auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "oldPassword": "password123",
  "newPassword": "newpassword456"
}
```

---

### 👥 User Management (ADMIN Only)

#### 1. Create User
```http
POST /users
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "fullName": "Jane Smith",
  "username": "janesmith",
  "email": "jane@example.com",
  "password": "password123",
  "role": "manager"
}
```

#### 2. Get All Users
```http
GET /users
Authorization: Bearer <admin-token>
```

**Response:**
```json
[
  {
    "id": 1,
    "fullName": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "cashier",
    "createdAt": "2025-10-03T10:00:00.000Z",
    "updatedAt": "2025-10-03T10:00:00.000Z"
  }
]
```

#### 3. Get User by ID
```http
GET /users/:id
Authorization: Bearer <admin-token>
```

#### 4. Update User
```http
PATCH /users/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "fullName": "John Updated",
  "role": "manager"
}
```

#### 5. Delete User
```http
DELETE /users/:id
Authorization: Bearer <admin-token>
```

---

### 🏷️ Category Management

#### 1. Create Category
```http
POST /categories
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Electronic devices and accessories"
}
```

#### 2. Get All Categories
```http
GET /categories
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Electronics",
    "description": "Electronic devices and accessories",
    "createdAt": "2025-10-03T10:00:00.000Z",
    "updatedAt": "2025-10-03T10:00:00.000Z"
  }
]
```

#### 3. Get Category by ID
```http
GET /categories/:id
```

#### 4. Update Category
```http
PATCH /categories/:id
Content-Type: application/json

{
  "name": "Electronics & Gadgets",
  "description": "Updated description"
}
```

#### 5. Delete Category
```http
DELETE /categories/:id
```

---

### 📦 Product Management

#### 1. Create Product
```http
POST /products
Content-Type: application/json

{
  "name": "Samsung Galaxy S23",
  "barcode": "8801643740856",
  "categoryId": 1,
  "price": 899.99,
  "stock": 50
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Samsung Galaxy S23",
  "barcode": "8801643740856",
  "categoryId": 1,
  "price": 899.99,
  "stock": 50,
  "createAt": "2025-10-03T10:00:00.000Z",
  "updateAt": "2025-10-03T10:00:00.000Z"
}
```

#### 2. Get All Products
```http
GET /products
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Samsung Galaxy S23",
    "barcode": "8801643740856",
    "categoryId": 1,
    "price": 899.99,
    "stock": 50,
    "category": {
      "id": 1,
      "name": "Electronics"
    }
  }
]
```

#### 3. Get Product by ID
```http
GET /products/:id
```

#### 4. Update Product
```http
PATCH /products/:id
Content-Type: application/json

{
  "price": 849.99,
  "stock": 45
}
```

#### 5. Delete Product
```http
DELETE /products/:id
```

---

### 👤 Customer Management

#### 1. Create Customer
```http
POST /customer
Content-Type: application/json

{
  "fullName": "Alice Johnson",
  "phone": "+1234567890",
  "email": "alice@example.com"
}
```

**Response:**
```json
{
  "id": 1,
  "fullName": "Alice Johnson",
  "phone": "+1234567890",
  "email": "alice@example.com",
  "createdAt": "2025-10-03T10:00:00.000Z",
  "updatedAt": "2025-10-03T10:00:00.000Z"
}
```

#### 2. Get All Customers
```http
GET /customer
```

#### 3. Get Customer by ID
```http
GET /customer/:id
```

#### 4. Update Customer
```http
PATCH /customer/:id
Content-Type: application/json

{
  "phone": "+0987654321"
}
```

#### 5. Delete Customer
```http
DELETE /customer/:id
```

---

### 🏢 Supplier Management (ADMIN/MANAGER Only)

#### 1. Create Supplier
```http
POST /suppliers
Authorization: Bearer <admin/manager-token>
Content-Type: application/json

{
  "name": "Tech Wholesale Inc.",
  "phone": "+1234567890",
  "email": "contact@techwholesale.com",
  "address": "123 Business St, Tech City, TC 12345"
}
```

#### 2. Get All Suppliers
```http
GET /suppliers
Authorization: Bearer <admin/manager-token>
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Tech Wholesale Inc.",
    "phone": "+1234567890",
    "email": "contact@techwholesale.com",
    "address": "123 Business St, Tech City, TC 12345",
    "createdAt": "2025-10-03T10:00:00.000Z",
    "updatedAt": "2025-10-03T10:00:00.000Z"
  }
]
```

#### 3. Get Supplier by ID
```http
GET /suppliers/:id
Authorization: Bearer <admin/manager-token>
```

#### 4. Update Supplier
```http
PUT /suppliers/:id
Authorization: Bearer <admin/manager-token>
Content-Type: application/json

{
  "phone": "+0987654321",
  "address": "456 New Address"
}
```

#### 5. Delete Supplier
```http
DELETE /suppliers/:id
Authorization: Bearer <admin/manager-token>
```

---

### 💰 Sales Management

#### 1. Create Sale
```http
POST /sales
Content-Type: application/json

{
  "userId": 1,
  "customerId": 1,
  "paymentMethod": "cash",  // cash, card, or mixed
  "status": "pending"       // pending or completed
}
```

**Response:**
```json
{
  "id": 1,
  "total": 0,
  "userId": 1,
  "customerId": 1,
  "paymentMethod": "cash",
  "status": "pending",
  "createdAt": "2025-10-03T10:00:00.000Z",
  "updatedAt": "2025-10-03T10:00:00.000Z"
}
```

#### 2. Get All Sales
```http
GET /sales
```

**Response:**
```json
[
  {
    "id": 1,
    "total": 1799.98,
    "userId": 1,
    "customerId": 1,
    "paymentMethod": "cash",
    "status": "completed",
    "createdAt": "2025-10-03T10:00:00.000Z",
    "updatedAt": "2025-10-03T10:00:00.000Z",
    "user": {
      "id": 1,
      "fullName": "John Doe"
    },
    "customer": {
      "id": 1,
      "fullName": "Alice Johnson"
    },
    "salesItems": [...]
  }
]
```

#### 3. Get Sale by ID
```http
GET /sales/:id
```

#### 4. Update Sale
```http
PATCH /sales/:id
Content-Type: application/json

{
  "status": "completed"
}
```

#### 5. Delete Sale
```http
DELETE /sales/:id
```

---

### 🛒 Sales Items Management

#### 1. Create Sale Item
```http
POST /sales-items
Content-Type: application/json

{
  "saleId": 1,
  "productId": 1,
  "quantity": 2
}
```

**Note**: The system automatically:
- Fetches the product price
- Calculates `unitPrice` (product price at time of sale)
- Calculates `total` (unitPrice × quantity)
- Updates the sale's total amount
- Decreases product stock

**Response:**
```json
{
  "id": 1,
  "saleId": 1,
  "productId": 1,
  "quantity": 2,
  "unitPrice": 899.99,
  "total": 1799.98,
  "createdAt": "2025-10-03T10:00:00.000Z",
  "updatedAt": "2025-10-03T10:00:00.000Z"
}
```

#### 2. Get All Sales Items
```http
GET /sales-items
```

#### 3. Get Sale Item by ID
```http
GET /sales-items/:id
```

#### 4. Update Sale Item
```http
PATCH /sales-items/:id
Content-Type: application/json

{
  "quantity": 3
}
```

#### 5. Delete Sale Item
```http
DELETE /sales-items/:id
```

---

### 📥 Purchase Management

#### 1. Create Purchase
```http
POST /purchases
Content-Type: application/json

{
  "userId": 1,
  "supplierId": 1,
  "status": "pending"  // pending or completed
}
```

**Response:**
```json
{
  "id": 1,
  "total": 0,
  "userId": 1,
  "supplierId": 1,
  "status": "pending",
  "createdAt": "2025-10-03T10:00:00.000Z",
  "updatedAt": "2025-10-03T10:00:00.000Z"
}
```

#### 2. Get All Purchases
```http
GET /purchases
```

**Response:**
```json
[
  {
    "id": 1,
    "total": 40000.00,
    "userId": 1,
    "supplierId": 1,
    "status": "completed",
    "createdAt": "2025-10-03T10:00:00.000Z",
    "updatedAt": "2025-10-03T10:00:00.000Z",
    "user": {
      "id": 1,
      "fullName": "John Doe"
    },
    "supplier": {
      "id": 1,
      "name": "Tech Wholesale Inc."
    },
    "purchaseItems": [...]
  }
]
```

#### 3. Get Purchase by ID
```http
GET /purchases/:id
```

#### 4. Update Purchase
```http
PATCH /purchases/:id
Content-Type: application/json

{
  "status": "completed"
}
```

#### 5. Delete Purchase
```http
DELETE /purchases/:id
```

---

### 📦 Purchase Items Management

#### 1. Create Purchase Item
```http
POST /purchase-Items
Content-Type: application/json

{
  "purchaseId": 1,
  "productId": 1,
  "quantity": 50,
  "unitCost": 800.00
}
```

**Note**: The system automatically:
- Calculates `total` (unitCost × quantity)
- Updates the purchase's total amount
- Increases product stock

**Response:**
```json
{
  "id": 1,
  "purchaseId": 1,
  "productId": 1,
  "quantity": 50,
  "unitCost": 800.00,
  "total": 40000.00,
  "createdAt": "2025-10-03T10:00:00.000Z",
  "updatedAt": "2025-10-03T10:00:00.000Z"
}
```

#### 2. Get All Purchase Items
```http
GET /purchase-Items
```

#### 3. Get Purchase Item by ID
```http
GET /purchase-Items/:id
```

#### 4. Update Purchase Item
```http
PATCH /purchase-Items/:id
Content-Type: application/json

{
  "quantity": 60,
  "unitCost": 780.00
}
```

#### 5. Delete Purchase Item
```http
DELETE /purchase-Items/:id
```

---

## Data Models

### 1. User Model
```typescript
{
  id: number;
  fullName: string;
  username: string;        // unique
  email: string;          // unique
  role: 'admin' | 'cashier' | 'manager';
  password: string;       // hashed
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  sales: Sale[];
  purchases: Purchase[];
}
```

### 2. Customer Model
```typescript
{
  id: number;
  fullName: string;
  phone: string;          // unique, nullable
  email: string;          // unique, nullable
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  sales: Sale[];
}
```

### 3. Supplier Model
```typescript
{
  id: number;
  name: string;
  phone: string;          // unique
  email: string;          // unique
  address: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  purchases: Purchase[];
}
```

### 4. Category Model
```typescript
{
  id: number;
  name: string;           // unique
  description: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  products: Product[];
}
```

### 5. Product Model
```typescript
{
  id: number;
  name: string;           // unique
  barcode: string;        // unique, nullable
  categoryId: number;     // nullable
  price: number;          // decimal(10,2)
  stock: number;          // default: 0
  createAt: Date;
  updateAt: Date;
  
  // Relations
  category: Category;
  salesItems: SalesItem[];
  purchaseItems: PurchaseItem[];
}
```

### 6. Sale Model
```typescript
{
  id: number;
  total: number;          // decimal(10,2), default: 0
  userId: number;         // nullable
  customerId: number;     // nullable
  paymentMethod: 'cash' | 'card' | 'mixed';  // default: 'cash'
  status: 'pending' | 'completed';           // default: 'pending'
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  user: User;
  customer: Customer;
  salesItems: SalesItem[];
}
```

### 7. SalesItem Model
```typescript
{
  id: number;
  saleId: number;
  productId: number;
  quantity: number;
  unitPrice: number;      // decimal(10,2) - price at time of sale
  total: number;          // decimal(10,2) - unitPrice * quantity
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  sale: Sale;
  product: Product;
  
  // Constraints
  // UNIQUE(saleId, productId) - prevents duplicate products in same sale
}
```

### 8. Purchase Model
```typescript
{
  id: number;
  total: number;          // decimal(10,2), default: 0
  supplierId: number;     // nullable
  userId: number;         // nullable
  status: 'pending' | 'completed';  // default: 'pending'
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  supplier: Supplier;
  user: User;
  purchaseItems: PurchaseItem[];
}
```

### 9. PurchaseItem Model
```typescript
{
  id: number;
  purchaseId: number;
  productId: number;
  quantity: number;
  unitCost: number;       // decimal(10,2) - cost per unit
  total: number;          // decimal(10,2) - unitCost * quantity
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  purchase: Purchase;
  product: Product;
  
  // Constraints
  // UNIQUE(purchaseId, productId) - prevents duplicate products in same purchase
}
```

---

## Business Logic

### 1. Stock Management

#### When Creating a Sale Item:
1. Fetch product details
2. Check if sufficient stock exists
3. Calculate `unitPrice` from current product price
4. Calculate `total` = `unitPrice` × `quantity`
5. **Decrease product stock** by quantity
6. Update sale's total amount
7. Save sale item

#### When Creating a Purchase Item:
1. Fetch product details
2. Calculate `total` = `unitCost` × `quantity`
3. **Increase product stock** by quantity
4. Update purchase's total amount
5. Save purchase item

#### When Updating Sale/Purchase Items:
- Adjust product stock based on quantity difference
- Recalculate totals
- Update parent transaction total

#### When Deleting Sale/Purchase Items:
- Restore product stock (for sales) or reduce stock (for purchases)
- Recalculate parent transaction total

### 2. Transaction Flow

#### Sales Transaction Flow:
```
1. Create Sale (with userId, customerId, paymentMethod)
   ↓
2. Add Sale Items (products + quantities)
   ↓ (each item)
   - Validate stock availability
   - Deduct from inventory
   - Calculate item total
   - Update sale total
   ↓
3. Mark Sale as "completed"
   ↓
4. Generate receipt/invoice
```

#### Purchase Transaction Flow:
```
1. Create Purchase (with userId, supplierId)
   ↓
2. Add Purchase Items (products + quantities + unit costs)
   ↓ (each item)
   - Add to inventory
   - Calculate item total
   - Update purchase total
   ↓
3. Mark Purchase as "completed"
   ↓
4. Stock is updated in real-time
```

### 3. Payment Methods

- **cash**: Full payment in cash
- **card**: Full payment by card (credit/debit)
- **mixed**: Combination of cash and card

### 4. Status States

- **pending**: Transaction created but not finalized
- **completed**: Transaction finalized and confirmed

### 5. Cascading Deletes

- Deleting a **Sale** → Deletes all associated **SalesItems** (CASCADE)
- Deleting a **Purchase** → Deletes all associated **PurchaseItems** (CASCADE)
- Deleting a **Product** → Deletes all associated **SalesItems** and **PurchaseItems** (CASCADE)
- Deleting a **User** → Sets `userId` to NULL in Sales and Purchases (SET NULL)
- Deleting a **Customer** → Sets `customerId` to NULL in Sales (SET NULL)
- Deleting a **Supplier** → Sets `supplierId` to NULL in Purchases (SET NULL)
- Deleting a **Category** → Sets `categoryId` to NULL in Products (SET NULL)

---

## Frontend Integration Guide

### 1. Authentication Setup

```javascript
// Login and store token
const login = async (email, password) => {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  localStorage.setItem('token', data.access_token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
};

// Create axios instance with auth header
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 2. Role-Based UI Components

```javascript
// Check user role
const userRole = JSON.parse(localStorage.getItem('user'))?.role;

// Conditional rendering based on role
{userRole === 'admin' && (
  <AdminPanel />
)}

{['admin', 'manager'].includes(userRole) && (
  <SupplierManagement />
)}

{userRole === 'cashier' && (
  <SalesInterface />
)}
```

### 3. Sales Process (POS Interface)

```javascript
// Step 1: Create sale transaction
const createSale = async (userId, customerId, paymentMethod) => {
  const response = await api.post('/sales', {
    userId,
    customerId,
    paymentMethod: paymentMethod || 'cash',
    status: 'pending'
  });
  return response.data; // Returns sale with ID
};

// Step 2: Add items to cart
const addItemToSale = async (saleId, productId, quantity) => {
  const response = await api.post('/sales-items', {
    saleId,
    productId,
    quantity
  });
  return response.data;
};

// Step 3: Complete sale
const completeSale = async (saleId) => {
  const response = await api.patch(`/sales/${saleId}`, {
    status: 'completed'
  });
  return response.data;
};

// Get updated sale with total
const getSale = async (saleId) => {
  const response = await api.get(`/sales/${saleId}`);
  return response.data;
};
```

### 4. Product Search/Barcode Scanner

```javascript
// Search products
const searchProducts = async (query) => {
  const response = await api.get('/products');
  const products = response.data;
  
  // Filter by name or barcode
  return products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.barcode === query
  );
};

// Get product by barcode
const getProductByBarcode = async (barcode) => {
  const response = await api.get('/products');
  const products = response.data;
  return products.find(p => p.barcode === barcode);
};
```

### 5. Inventory Management

```javascript
// Get low stock products
const getLowStockProducts = async (threshold = 10) => {
  const response = await api.get('/products');
  return response.data.filter(p => p.stock <= threshold);
};

// Create purchase order
const createPurchaseOrder = async (supplierId, userId, items) => {
  // Step 1: Create purchase
  const purchase = await api.post('/purchases', {
    supplierId,
    userId,
    status: 'pending'
  });
  
  // Step 2: Add items
  for (const item of items) {
    await api.post('/purchase-Items', {
      purchaseId: purchase.data.id,
      productId: item.productId,
      quantity: item.quantity,
      unitCost: item.unitCost
    });
  }
  
  // Step 3: Complete purchase
  await api.patch(`/purchases/${purchase.data.id}`, {
    status: 'completed'
  });
  
  return purchase.data;
};
```

### 6. Reports & Analytics

```javascript
// Sales report
const getSalesReport = async (startDate, endDate) => {
  const response = await api.get('/sales');
  const sales = response.data;
  
  return sales.filter(sale => {
    const saleDate = new Date(sale.createdAt);
    return saleDate >= startDate && saleDate <= endDate;
  });
};

// Calculate total revenue
const calculateRevenue = (sales) => {
  return sales.reduce((sum, sale) => sum + parseFloat(sale.total), 0);
};

// Top selling products
const getTopSellingProducts = async (limit = 10) => {
  const response = await api.get('/sales-items');
  const salesItems = response.data;
  
  const productSales = salesItems.reduce((acc, item) => {
    if (!acc[item.productId]) {
      acc[item.productId] = {
        productId: item.productId,
        product: item.product,
        totalQuantity: 0,
        totalRevenue: 0
      };
    }
    acc[item.productId].totalQuantity += item.quantity;
    acc[item.productId].totalRevenue += parseFloat(item.total);
    return acc;
  }, {});
  
  return Object.values(productSales)
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, limit);
};
```

### 7. Error Handling

```javascript
// Generic error handler
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Forbidden - insufficient permissions
      alert('You do not have permission to perform this action');
    } else {
      // Other errors
      console.error('API Error:', error.response?.data?.message);
    }
    return Promise.reject(error);
  }
);
```

### 8. Recommended Frontend Structure

```
frontend/
├── src/
│   ├── api/
│   │   ├── auth.js              # Authentication API calls
│   │   ├── products.js          # Product API calls
│   │   ├── sales.js             # Sales API calls
│   │   ├── purchases.js         # Purchase API calls
│   │   ├── customers.js         # Customer API calls
│   │   └── suppliers.js         # Supplier API calls
│   │
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   ├── POS/
│   │   │   ├── SalesInterface.jsx
│   │   │   ├── ProductSearch.jsx
│   │   │   ├── Cart.jsx
│   │   │   └── Payment.jsx
│   │   │
│   │   ├── Inventory/
│   │   │   ├── ProductList.jsx
│   │   │   ├── ProductForm.jsx
│   │   │   ├── CategoryManagement.jsx
│   │   │   └── StockAlerts.jsx
│   │   │
│   │   ├── Purchases/
│   │   │   ├── PurchaseOrderList.jsx
│   │   │   ├── CreatePurchaseOrder.jsx
│   │   │   └── SupplierManagement.jsx
│   │   │
│   │   ├── Customers/
│   │   │   ├── CustomerList.jsx
│   │   │   └── CustomerForm.jsx
│   │   │
│   │   ├── Reports/
│   │   │   ├── SalesReport.jsx
│   │   │   ├── InventoryReport.jsx
│   │   │   └── Dashboard.jsx
│   │   │
│   │   └── Admin/
│   │       ├── UserManagement.jsx
│   │       └── SystemSettings.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useProducts.js
│   │   └── useSales.js
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   │
│   └── utils/
│       ├── api.js               # Axios instance
│       ├── constants.js         # API URLs, roles, etc.
│       └── helpers.js           # Utility functions
```

### 9. Key Frontend Features to Implement

#### Essential Features:
1. **Login/Authentication** ✓
2. **POS Sales Interface**
   - Barcode scanner integration
   - Product search
   - Shopping cart
   - Payment processing
   - Receipt printing
3. **Product Management**
   - CRUD operations
   - Stock tracking
   - Low stock alerts
4. **Customer Management**
   - CRUD operations
   - Purchase history
5. **Purchase Orders**
   - Create orders
   - Receive inventory
   - Supplier management

#### Advanced Features:
6. **Dashboard/Reports**
   - Daily sales summary
   - Top-selling products
   - Revenue charts
   - Inventory status
7. **User Management** (Admin only)
8. **Multi-language Support**
9. **Receipt/Invoice Generation**
10. **Keyboard Shortcuts** for faster POS operations

### 10. Environment Variables

Create a `.env` file in your frontend:

```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_API_TIMEOUT=30000
```

---

## Additional Notes

### ⚠️ Security Considerations

1. **Missing Authentication**: Most endpoints (products, sales, customers, etc.) are currently **NOT protected**. Consider adding authentication guards to sensitive endpoints.

2. **CORS Configuration**: Configure CORS in `main.ts` for production:
```typescript
app.enableCors({
  origin: 'https://your-frontend-domain.com',
  credentials: true
});
```

3. **Input Validation**: The system uses `class-validator` for DTO validation. Ensure all inputs are validated on the frontend as well.

4. **SQL Injection**: TypeORM protects against SQL injection, but always validate user inputs.

### 📝 Development Tips

1. **Database Synchronize**: `synchronize: true` is enabled in TypeORM config. **Disable in production** to prevent data loss.

2. **Password Hashing**: Passwords are hashed with bcrypt before storage.

3. **Decimal Precision**: All monetary values use `decimal(10,2)` for precision.

4. **Unique Constraints**: Duplicate entries are prevented at database level for critical fields.

5. **Soft Deletes**: Consider implementing soft deletes for sales/purchase history preservation.

### 🚀 Future Enhancements

1. Add pagination for list endpoints
2. Implement search and filtering
3. Add transaction history/audit logs
4. Implement refunds and returns
5. Add discount and promotion system
6. Multi-currency support
7. Receipt email functionality
8. Export reports to PDF/Excel
9. Real-time notifications
10. Mobile app support

---

## Contact & Support

For issues or questions about this API:
- Repository: GitHub - Omar1Saad/POS_System
- Branch: main

---

**Last Updated**: October 3, 2025
**API Version**: 1.0.0
**Backend Framework**: NestJS v11.1.6
