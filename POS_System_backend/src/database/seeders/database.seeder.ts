import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { Customer } from '../../customers/entities/customer.entity';
import { Supplier } from '../../suppliers/entities/supplier.entity';
import { Products } from '../../product/entities/product.entity';
import { Sale } from '../../sales/entities/sale.entity';
import { Purchase } from '../../purchases/entities/purchase.entity';
import { SalesItems } from '../../sales_items/entities/salesItems.entity';
import { PurchaseItems } from '../../purchase_items/entities/purchaseItems.entity';
import * as bcrypt from 'bcrypt';

export class DatabaseSeeder {
  constructor(private dataSource: DataSource) {}

  async seed() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Clear existing data
      await queryRunner.query('DELETE FROM sales_items');
      await queryRunner.query('DELETE FROM purchase_items');
      await queryRunner.query('DELETE FROM sales');
      await queryRunner.query('DELETE FROM purchases');
      await queryRunner.query('DELETE FROM "Products"');
      await queryRunner.query('DELETE FROM customers');
      await queryRunner.query('DELETE FROM suppliers');
      await queryRunner.query('DELETE FROM categories');
      await queryRunner.query('DELETE FROM users');

      // Reset sequences
      await queryRunner.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
      await queryRunner.query('ALTER SEQUENCE categories_id_seq RESTART WITH 1');
      await queryRunner.query('ALTER SEQUENCE customers_id_seq RESTART WITH 1');
      await queryRunner.query('ALTER SEQUENCE suppliers_id_seq RESTART WITH 1');
      await queryRunner.query('ALTER SEQUENCE "Products_id_seq" RESTART WITH 1');
      await queryRunner.query('ALTER SEQUENCE sales_id_seq RESTART WITH 1');
      await queryRunner.query('ALTER SEQUENCE purchases_id_seq RESTART WITH 1');
      await queryRunner.query('ALTER SEQUENCE sales_items_id_seq RESTART WITH 1');
      await queryRunner.query('ALTER SEQUENCE purchase_items_id_seq RESTART WITH 1');

      // Seed Users
      const hashedPassword = await bcrypt.hash('password123', 10);
      const users = [
        { fullName: 'Admin User', username: 'admin', email: 'admin@pos.com', role: 'admin', password: hashedPassword },
        { fullName: 'Manager User', username: 'manager', email: 'manager@pos.com', role: 'manager', password: hashedPassword },
        { fullName: 'Cashier User', username: 'cashier', email: 'cashier@pos.com', role: 'cashier', password: hashedPassword },
      ];
      
      for (const userData of users) {
        await queryRunner.query(
          `INSERT INTO users ("fullName", username, email, role, password, "createdAt", "updatedAt") 
           VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
          [userData.fullName, userData.username, userData.email, userData.role, userData.password]
        );
      }

      // Seed Categories
      const categories = [
        { name: 'Electronics', description: 'Electronic devices and accessories' },
        { name: 'Clothing', description: 'Fashion and apparel items' },
        { name: 'Books', description: 'Books and educational materials' },
        { name: 'Home & Garden', description: 'Home improvement and garden supplies' },
        { name: 'Sports', description: 'Sports equipment and accessories' },
      ];

      for (const categoryData of categories) {
        await queryRunner.query(
          `INSERT INTO categories (name, description, "createdAt", "updatedAt") 
           VALUES ($1, $2, NOW(), NOW())`,
          [categoryData.name, categoryData.description]
        );
      }

      // Seed Customers
      const customers = [
        { fullName: 'John Doe', phone: '123-456-7890', email: 'john.doe@email.com' },
        { fullName: 'Jane Smith', phone: '123-456-7891', email: 'jane.smith@email.com' },
        { fullName: 'Bob Johnson', phone: '123-456-7892', email: 'bob.johnson@email.com' },
        { fullName: 'Alice Brown', phone: '123-456-7893', email: 'alice.brown@email.com' },
        { fullName: 'Charlie Wilson', phone: '123-456-7894', email: 'charlie.wilson@email.com' },
        { fullName: 'Diana Davis', phone: '123-456-7895', email: 'diana.davis@email.com' },
        { fullName: 'Frank Miller', phone: '123-456-7896', email: 'frank.miller@email.com' },
        { fullName: 'Grace Taylor', phone: '123-456-7897', email: 'grace.taylor@email.com' },
      ];

      for (const customerData of customers) {
        await queryRunner.query(
          `INSERT INTO customers ("fullName", phone, email, "createdAt", "updatedAt") 
           VALUES ($1, $2, $3, NOW(), NOW())`,
          [customerData.fullName, customerData.phone, customerData.email]
        );
      }

      // Seed Suppliers
      const suppliers = [
        { name: 'Tech Distributors Inc', phone: '555-0001', email: 'contact@techdist.com', address: '123 Tech St, Silicon Valley, CA' },
        { name: 'Fashion Wholesale Co', phone: '555-0002', email: 'orders@fashionwholesale.com', address: '456 Fashion Ave, NYC, NY' },
        { name: 'Book Publishers Ltd', phone: '555-0003', email: 'sales@bookpub.com', address: '789 Reading Rd, Boston, MA' },
        { name: 'Home Supply Partners', phone: '555-0004', email: 'info@homesupply.com', address: '321 Home St, Atlanta, GA' },
        { name: 'Sports Equipment Co', phone: '555-0005', email: 'sales@sportsequip.com', address: '654 Sports Blvd, Denver, CO' },
      ];

      for (const supplierData of suppliers) {
        await queryRunner.query(
          `INSERT INTO suppliers (name, phone, email, address, "createdAt", "updatedAt") 
           VALUES ($1, $2, $3, $4, NOW(), NOW())`,
          [supplierData.name, supplierData.phone, supplierData.email, supplierData.address]
        );
      }

      // Seed Products
      const products = [
        // Electronics
        { name: 'iPhone 15 Pro', barcode: '1001001', categoryId: 1, price: 999.99, stock: 25 },
        { name: 'Samsung Galaxy S24', barcode: '1001002', categoryId: 1, price: 899.99, stock: 30 },
        { name: 'MacBook Air M3', barcode: '1001003', categoryId: 1, price: 1299.99, stock: 15 },
        { name: 'iPad Pro 12.9"', barcode: '1001004', categoryId: 1, price: 1099.99, stock: 20 },
        { name: 'AirPods Pro', barcode: '1001005', categoryId: 1, price: 249.99, stock: 50 },
        { name: 'Apple Watch Series 9', barcode: '1001006', categoryId: 1, price: 399.99, stock: 8 }, // Low stock
        
        // Clothing
        { name: 'Nike Air Max Sneakers', barcode: '2001001', categoryId: 2, price: 129.99, stock: 40 },
        { name: 'Levi\'s 501 Jeans', barcode: '2001002', categoryId: 2, price: 89.99, stock: 35 },
        { name: 'Adidas Hoodie', barcode: '2001003', categoryId: 2, price: 59.99, stock: 25 },
        { name: 'Tommy Hilfiger Polo', barcode: '2001004', categoryId: 2, price: 69.99, stock: 5 }, // Low stock
        
        // Books
        { name: 'The Great Gatsby', barcode: '3001001', categoryId: 3, price: 14.99, stock: 100 },
        { name: 'To Kill a Mockingbird', barcode: '3001002', categoryId: 3, price: 16.99, stock: 85 },
        { name: 'Programming TypeScript', barcode: '3001003', categoryId: 3, price: 49.99, stock: 30 },
        { name: 'Clean Code', barcode: '3001004', categoryId: 3, price: 39.99, stock: 7 }, // Low stock
        
        // Home & Garden
        { name: 'Coffee Maker Deluxe', barcode: '4001001', categoryId: 4, price: 199.99, stock: 20 },
        { name: 'Garden Tool Set', barcode: '4001002', categoryId: 4, price: 89.99, stock: 15 },
        { name: 'LED Desk Lamp', barcode: '4001003', categoryId: 4, price: 49.99, stock: 3 }, // Low stock
        
        // Sports
        { name: 'Basketball Wilson', barcode: '5001001', categoryId: 5, price: 29.99, stock: 60 },
        { name: 'Tennis Racket Pro', barcode: '5001002', categoryId: 5, price: 149.99, stock: 25 },
        { name: 'Yoga Mat Premium', barcode: '5001003', categoryId: 5, price: 39.99, stock: 45 },
      ];

      for (const productData of products) {
        await queryRunner.query(
          `INSERT INTO "Products" (name, barcode, "categoryId", price, stock, "createAt", "updateAt") 
           VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
          [productData.name, productData.barcode, productData.categoryId, productData.price, productData.stock]
        );
      }

      // Seed Sales (last 30 days)
      const salesData: Array<{
        total: number;
        customerId: number;
        userId: number;
        paymentMethod: string;
        status: string;
        createdAt: Date;
      }> = [];
      const currentDate = new Date();
      
      for (let i = 0; i < 30; i++) {
        const saleDate = new Date(currentDate);
        saleDate.setDate(saleDate.getDate() - i);
        
        // Create 2-5 sales per day
        const salesPerDay = Math.floor(Math.random() * 4) + 2;
        
        for (let j = 0; j < salesPerDay; j++) {
          const customerId = Math.floor(Math.random() * 8) + 1;
          const userId = Math.floor(Math.random() * 3) + 1;
          const paymentMethods = ['cash', 'card'];
          const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
          
          // Random total between 50 and 1000
          const total = Math.floor(Math.random() * 950) + 50;
          
          salesData.push({
            total,
            customerId,
            userId,
            paymentMethod,
            status: 'completed',
            createdAt: saleDate,
          });
        }
      }

      for (const saleData of salesData) {
        await queryRunner.query(
          `INSERT INTO sales (total, "customerId", "userId", "paymentMethod", status, "createdAt", "updatedAt") 
           VALUES ($1, $2, $3, $4, $5, $6, $6)`,
          [saleData.total, saleData.customerId, saleData.userId, saleData.paymentMethod, saleData.status, saleData.createdAt]
        );
      }

      // Seed Purchases (last 60 days)
      const purchasesData: Array<{
        total: number;
        supplierId: number;
        userId: number;
        status: string;
        createdAt: Date;
      }> = [];
      
      for (let i = 0; i < 60; i++) {
        const purchaseDate = new Date(currentDate);
        purchaseDate.setDate(purchaseDate.getDate() - i);
        
        // Create 1-3 purchases per day
        const purchasesPerDay = Math.floor(Math.random() * 3) + 1;
        
        for (let j = 0; j < purchasesPerDay; j++) {
          const supplierId = Math.floor(Math.random() * 5) + 1;
          const userId = Math.floor(Math.random() * 3) + 1;
          
          // Random total between 100 and 2000
          const total = Math.floor(Math.random() * 1900) + 100;
          
          purchasesData.push({
            total,
            supplierId,
            userId,
            status: 'completed',
            createdAt: purchaseDate,
          });
        }
      }

      for (const purchaseData of purchasesData) {
        await queryRunner.query(
          `INSERT INTO purchases (total, "supplierId", "userId", status, "createdAt", "updatedAt") 
           VALUES ($1, $2, $3, $4, $5, $5)`,
          [purchaseData.total, purchaseData.supplierId, purchaseData.userId, purchaseData.status, purchaseData.createdAt]
        );
      }

      // Seed Sales Items (for recent sales)
      const recentSales = await queryRunner.query('SELECT id FROM sales ORDER BY "createdAt" DESC LIMIT 20');
      
      for (const sale of recentSales) {
        const itemsCount = Math.floor(Math.random() * 3) + 1; // 1-3 items per sale
        const usedProducts = new Set(); // Track used products for this sale
        
        for (let i = 0; i < itemsCount; i++) {
          let productId;
          // Ensure unique product for this sale
          do {
            productId = Math.floor(Math.random() * 20) + 1;
          } while (usedProducts.has(productId));
          
          usedProducts.add(productId);
          const quantity = Math.floor(Math.random() * 3) + 1;
          const price = Math.floor(Math.random() * 500) + 20;
          
          const total = price * quantity;
          await queryRunner.query(
            `INSERT INTO sales_items ("saleId", "productId", quantity, "unitPrice", total, "createdAt", "updatedAt") 
             VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
            [sale.id, productId, quantity, price, total]
          );
        }
      }

      // Seed Purchase Items (for recent purchases)
      const recentPurchases = await queryRunner.query('SELECT id FROM purchases ORDER BY "createdAt" DESC LIMIT 15');
      
      for (const purchase of recentPurchases) {
        const itemsCount = Math.floor(Math.random() * 4) + 1; // 1-4 items per purchase
        const usedProducts = new Set(); // Track used products for this purchase
        
        for (let i = 0; i < itemsCount; i++) {
          let productId;
          // Ensure unique product for this purchase
          do {
            productId = Math.floor(Math.random() * 20) + 1;
          } while (usedProducts.has(productId));
          
          usedProducts.add(productId);
          const quantity = Math.floor(Math.random() * 10) + 5;
          const price = Math.floor(Math.random() * 300) + 10;
          
          const total = price * quantity;
          await queryRunner.query(
            `INSERT INTO purchase_items ("purchaseId", "productId", quantity, "unitCost", total, "createdAt", "updatedAt") 
             VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
            [purchase.id, productId, quantity, price, total]
          );
        }
      }

      await queryRunner.commitTransaction();
      console.log('✅ Database seeded successfully!');
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Error seeding database:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}