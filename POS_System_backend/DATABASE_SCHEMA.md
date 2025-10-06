# POS System Database Schema

## Database Diagram (dbdiagram.io)

You can copy the code below and paste it into [dbdiagram.io](https://dbdiagram.io/) to visualize the database schema.

```dbml
// POS System Database Schema
// Created: October 3, 2025

Table users {
  id integer [primary key, increment]
  fullName varchar [not null]
  username varchar [unique, not null]
  email varchar [unique, not null]
  role varchar [not null, note: 'Values: admin, cashier, manager']
  password varchar [not null]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]
  
  Note: 'System users with different roles (admin, cashier, manager)'
}

Table categories {
  id integer [primary key, increment]
  name varchar(150) [unique, not null]
  description text [not null]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]
  
  Note: 'Product categories for inventory organization'
}

Table customers {
  id integer [primary key, increment]
  fullName varchar [not null]
  phone varchar(20) [unique, null]
  email varchar(100) [unique, null]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]
  
  Note: 'Customer information for sales tracking'
}

Table suppliers {
  id integer [primary key, increment]
  name varchar(150) [not null]
  phone varchar(20) [unique, not null]
  email varchar(100) [unique, not null]
  address text [not null]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]
  
  Note: 'Supplier information for purchase management'
}

Table Products {
  id integer [primary key, increment]
  name varchar(150) [unique, not null]
  barcode varchar(50) [unique, null]
  categoryId integer [null]
  price numeric(10,2) [not null]
  stock integer [default: 0]
  createAt timestamp [default: `now()`]
  updateAt timestamp [default: `now()`]
  
  Note: 'Product inventory with pricing and stock levels'
}

Table sales {
  id integer [primary key, increment]
  total numeric(10,2) [default: 0]
  userId integer [null]
  customerId integer [null]
  paymentMethod varchar [not null, default: 'cash', note: 'Values: cash, card, mixed']
  status varchar [not null, default: 'pending', note: 'Values: pending, completed']
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]
  
  Note: 'Sales transactions with payment and status tracking'
}

Table sales_items {
  id integer [primary key, increment]
  saleId integer [not null]
  productId integer [not null]
  quantity integer [not null]
  total numeric(10,2) [not null]
  unitPrice numeric(10,2) [not null]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]
  
  Indexes {
    (saleId, productId) [unique]
  }
  
  Note: 'Individual items in a sale transaction'
}

Table purchases {
  id integer [primary key, increment]
  total numeric(10,2) [default: 0]
  supplierId integer [null]
  userId integer [null]
  status varchar [not null, default: 'pending', note: 'Values: pending, completed']
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]
  
  Note: 'Purchase orders from suppliers'
}

Table purchase_items {
  id integer [primary key, increment]
  purchaseId integer [not null]
  productId integer [not null]
  quantity integer [not null]
  total numeric(10,2) [not null]
  unitCost numeric(10,2) [not null]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp [default: `now()`]
  
  Indexes {
    (purchaseId, productId) [unique]
  }
  
  Note: 'Individual items in a purchase order'
}

// Relationships

// Products -> Categories
Ref: Products.categoryId > categories.id [delete: set null]

// Sales -> Customers
Ref: sales.customerId > customers.id [delete: set null]

// Sales -> Users
Ref: sales.userId > users.id [delete: set null]

// Sales Items -> Sales
Ref: sales_items.saleId > sales.id [delete: cascade]

// Sales Items -> Products
Ref: sales_items.productId > Products.id [delete: cascade]

// Purchases -> Suppliers
Ref: purchases.supplierId > suppliers.id [delete: set null]

// Purchases -> Users
Ref: purchases.userId > users.id [delete: set null]

// Purchase Items -> Purchases
Ref: purchase_items.purchaseId > purchases.id [delete: cascade]

// Purchase Items -> Products
Ref: purchase_items.productId > Products.id [delete: cascade]
```

## Schema Overview

### Core Entities

1. **Users** - System users with roles (admin, cashier, manager)
2. **Categories** - Product categorization
3. **Customers** - Customer information for sales
4. **Suppliers** - Supplier information for purchases
5. **Products** - Inventory items with pricing and stock

### Transaction Entities

6. **Sales** - Sales transactions
7. **Sales Items** - Line items for sales
8. **Purchases** - Purchase orders
9. **Purchase Items** - Line items for purchases

### Key Relationships

- **Users** can create multiple **Sales** and **Purchases**
- **Customers** can have multiple **Sales**
- **Suppliers** can have multiple **Purchases**
- **Categories** contain multiple **Products**
- **Sales** contain multiple **Sales Items**
- **Purchases** contain multiple **Purchase Items**
- **Products** appear in both **Sales Items** and **Purchase Items**

### Delete Behaviors

- **SET NULL**: When a user, customer, supplier, or category is deleted, related records maintain integrity
- **CASCADE**: When a sale or purchase is deleted, all related items are automatically deleted

### Unique Constraints

- **sales_items**: Unique combination of (saleId, productId) - prevents duplicate products in a sale
- **purchase_items**: Unique combination of (purchaseId, productId) - prevents duplicate products in a purchase

## How to Use

1. Visit [dbdiagram.io](https://dbdiagram.io/)
2. Copy the DBML code from the code block above
3. Paste it into the editor
4. The diagram will be automatically generated
5. You can export it as PNG, PDF, or SQL

## Database Type

This schema is designed for **PostgreSQL** with TypeORM as the ORM.
