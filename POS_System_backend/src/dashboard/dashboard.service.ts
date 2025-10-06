import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Sale } from '../sales/entities/sale.entity';
import { Products } from '../product/entities/product.entity';
import { Customer } from '../customers/entities/customer.entity';
import { Supplier } from '../suppliers/entities/supplier.entity';
import { Purchase } from '../purchases/entities/purchase.entity';
import { User } from '../users/entities/user.entity';
import { AuditService } from '../audit/audit.service';
import { DashboardSummaryDto } from './dto/dashboard-summary.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,

    private readonly auditService: AuditService,
  ) {}

  async getDashboardSummary(user: User): Promise<DashboardSummaryDto> {
    // Log dashboard access
    await this.auditService.logUserActivity(
      user,
      'DASHBOARD_SUMMARY_VIEWED',
      'dashboard',
      undefined,
      { role: user.role }
    );

    // Role-based data filtering
    const isAdmin = user.role === 'admin';
    const isManager = user.role === 'manager';
    const isCashier = user.role === 'cashier';

    // Get total sales amount (role-based filtering)
    let salesQuery = this.saleRepository
      .createQueryBuilder('sale')
      .where('sale.status = :status', { status: 'completed' });
    
    // Cashiers can only see their own sales
    if (isCashier) {
      salesQuery = salesQuery.andWhere('sale.userId = :userId', { userId: user.id });
    }
    
    const totalSalesResult = await salesQuery
      .select('SUM(sale.total)', 'totalSales')
      .getRawOne();
    
    const totalSales = parseFloat(totalSalesResult.totalSales || '0');

    // Get user's personal sales count (for all roles)
    const userSalesCount = await this.saleRepository.count({
      where: { 
        userId: user.id, 
        status: 'completed' 
      }
    });

    // Get total purchases amount (admin and manager only)
    let totalPurchases = 0;
    if (isAdmin || isManager) {
      const totalPurchasesResult = await this.purchaseRepository
        .createQueryBuilder('purchase')
        .select('SUM(purchase.total)', 'totalPurchases')
        .getRawOne();
      
      totalPurchases = parseFloat(totalPurchasesResult.totalPurchases || '0');
    }

    // Get total products count
    const totalProducts = await this.productsRepository.count();

    // Get low stock products (stock < 10)
    const lowStockProducts = await this.productsRepository.count({
      where: {
        stock: LessThan(10)
      }
    });

    // Get total customers count
    const totalCustomers = await this.customerRepository.count();

    // Get total suppliers count
    const totalSuppliers = await this.supplierRepository.count();

    // Get recent sales (last 10) - role-based filtering
    let recentSalesQuery = this.saleRepository
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.customer', 'customer')
      .leftJoinAndSelect('sale.user', 'user')
      .orderBy('sale.createdAt', 'DESC')
      .take(10);

    // Cashiers can only see their own sales
    if (isCashier) {
      recentSalesQuery = recentSalesQuery.where('sale.userId = :userId', { userId: user.id });
    }

    const recentSales = await recentSalesQuery.getMany();

    // Get top products by sales quantity
    const topProducts = await this.productsRepository
      .createQueryBuilder('product')
      .leftJoin('product.salesItems', 'salesItems')
      .leftJoin('salesItems.sale', 'sale')
      .where('sale.status = :status', { status: 'completed' })
      .groupBy('product.id')
      .orderBy('SUM(salesItems.quantity)', 'DESC')
      .take(5)
      .getMany();

    // Calculate sales trend (current month vs previous month)
    const currentMonth = new Date();
    const previousMonth = new Date();
    previousMonth.setMonth(previousMonth.getMonth() - 1);

    const currentMonthSales = await this.saleRepository
      .createQueryBuilder('sale')
      .where('sale.status = :status', { status: 'completed' })
      .andWhere('sale.createdAt >= :start', { start: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1) })
      .andWhere('sale.createdAt < :end', { end: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1) })
      .select('SUM(sale.total)', 'total')
      .getRawOne();

    const previousMonthSales = await this.saleRepository
      .createQueryBuilder('sale')
      .where('sale.status = :status', { status: 'completed' })
      .andWhere('sale.createdAt >= :start', { start: new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1) })
      .andWhere('sale.createdAt < :end', { end: new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 1) })
      .select('SUM(sale.total)', 'total')
      .getRawOne();

    const currentSalesAmount = parseFloat(currentMonthSales.total || '0');
    const previousSalesAmount = parseFloat(previousMonthSales.total || '0');
    const salesPercentage = previousSalesAmount > 0 
      ? ((currentSalesAmount - previousSalesAmount) / previousSalesAmount) * 100 
      : 0;

    // Calculate purchases trend
    const currentMonthPurchases = await this.purchaseRepository
      .createQueryBuilder('purchase')
      .andWhere('purchase.createdAt >= :start', { start: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1) })
      .andWhere('purchase.createdAt < :end', { end: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1) })
      .select('SUM(purchase.total)', 'total')
      .getRawOne();

    const previousMonthPurchases = await this.purchaseRepository
      .createQueryBuilder('purchase')
      .andWhere('purchase.createdAt >= :start', { start: new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1) })
      .andWhere('purchase.createdAt < :end', { end: new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 1) })
      .select('SUM(purchase.total)', 'total')
      .getRawOne();

    const currentPurchasesAmount = parseFloat(currentMonthPurchases.total || '0');
    const previousPurchasesAmount = parseFloat(previousMonthPurchases.total || '0');
    const purchasesPercentage = previousPurchasesAmount > 0 
      ? ((currentPurchasesAmount - previousPurchasesAmount) / previousPurchasesAmount) * 100 
      : 0;

    return {
      totalSales,
      totalPurchases,
      totalProducts,
      lowStockProducts,
      totalCustomers,
      totalSuppliers,
      recentSales,
      topProducts,
      salesTrend: {
        current: currentSalesAmount,
        previous: previousSalesAmount,
        percentage: Math.round(salesPercentage * 100) / 100
      },
      purchasesTrend: {
        current: currentPurchasesAmount,
        previous: previousPurchasesAmount,
        percentage: Math.round(purchasesPercentage * 100) / 100
      },
      // User-specific information
      userContext: {
        userId: user.id,
        userName: user.fullName,
        userRole: user.role,
        personalSalesCount: userSalesCount,
        canViewPurchases: isAdmin || isManager,
        canViewAllSales: isAdmin || isManager
      }
    };
  }

  async getLowStockProducts(limit: number = 10, user: User) {
    return await this.productsRepository.find({
      where: {
        stock: LessThan(10)
      },
      relations: ['category'],
      order: { stock: 'ASC' },
      take: limit
    });
  }

  async getTopSellingProducts(limit: number = 10, user: User) {
    let topProductsQuery = this.productsRepository
      .createQueryBuilder('product')
      .leftJoin('product.salesItems', 'salesItems')
      .leftJoin('salesItems.sale', 'sale')
      .where('sale.status = :status', { status: 'completed' });

    // Cashiers can only see top products from their own sales
    if (user.role === 'cashier') {
      topProductsQuery = topProductsQuery.andWhere('sale.userId = :userId', { userId: user.id });
    }

    return await topProductsQuery
      .select('product.*')
      .addSelect('SUM(salesItems.quantity)', 'totalSold')
      .groupBy('product.id')
      .orderBy('SUM(salesItems.quantity)', 'DESC')
      .take(limit)
      .getRawAndEntities();
  }

  async getSalesAnalytics(days: number = 30, user: User) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let analyticsQuery = this.saleRepository
      .createQueryBuilder('sale')
      .where('sale.status = :status', { status: 'completed' })
      .andWhere('sale.createdAt >= :startDate', { startDate })
      .andWhere('sale.createdAt <= :endDate', { endDate });

    // Cashiers can only see their own sales analytics
    if (user.role === 'cashier') {
      analyticsQuery = analyticsQuery.andWhere('sale.userId = :userId', { userId: user.id });
    }

    return await analyticsQuery
      .select('DATE(sale.createdAt)', 'date')
      .addSelect('SUM(sale.total)', 'totalSales')
      .addSelect('COUNT(sale.id)', 'totalOrders')
      .groupBy('DATE(sale.createdAt)')
      .orderBy('DATE(sale.createdAt)', 'ASC')
      .getRawMany();
  }
}