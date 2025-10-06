import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Sale, PaymentMethod, statusState } from "./entities/sale.entity";
import { CreateSaleDto } from "./dto/create-sale.dto";
import { UpdateSaleDto } from "./dto/update-sale.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { CustomerService } from "src/customers/customer.services";
import { UserService } from "src/users/user.services";
import { User } from "src/users/entities/user.entity";
import { AuditService } from "src/audit/audit.service";
import { SalesItems } from "src/sales_items/entities/salesItems.entity";
import { Products } from "src/product/entities/product.entity";




@Injectable()
export class SaleService {
    constructor(
        @InjectRepository(Sale)
        private readonly saleRepository: Repository<Sale>,
        @InjectRepository(SalesItems)
        private readonly salesItemsRepository: Repository<SalesItems>,
        @InjectRepository(Products)
        private readonly productsRepository: Repository<Products>,
        private readonly userService: UserService,
        private readonly customerService: CustomerService,
        private readonly auditService: AuditService,
    ){}

    async createSale(createSaleDto: CreateSaleDto, currentUser: User): Promise<Sale> {
        const { customerId, paymentMethod, userId, items } = createSaleDto;
        
        // Validate user permissions - cashiers can only create sales for themselves
        if (currentUser.role === 'cashier' && userId !== currentUser.id) {
            throw new ForbiddenException('Cashiers can only create sales for themselves');
        }
        
        // Validate target user exists
        const targetUser = await this.userService.getUserById(userId);
        if (!targetUser) {
            throw new NotFoundException('Target user not found');
        }

        // Validate customer exists (optional - can be null for walk-in customers)
        let customer: any = null;
        if (customerId) {
            customer = await this.customerService.getCustomerById(customerId);
            if (!customer) {
                throw new NotFoundException('Customer not found');
            }
        }

        // Validate and process sale items
        if (!items || items.length === 0) {
            throw new BadRequestException('Sale must contain at least one item');
        }

        let totalAmount = 0;
        const validatedItems: Array<{
            productId: number;
            quantity: number;
            unitPrice: number;
            total: number;
            product: Products;
        }> = [];

        for (const item of items) {
            const product = await this.productsRepository.findOne({ 
                where: { id: item.productId } 
            });
            
            if (!product) {
                throw new NotFoundException(`Product with ID ${item.productId} not found`);
            }

            if (product.stock < item.quantity) {
                throw new BadRequestException(
                    `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
                );
            }

            const unitPrice = item.unitPrice || product.price;
            const itemTotal = item.quantity * unitPrice;
            totalAmount += itemTotal;

            validatedItems.push({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice,
                total: itemTotal,
                product
            });
        }

        // Create the sale
        const sale = this.saleRepository.create({
            customerId: customerId || undefined,
            paymentMethod: paymentMethod || PaymentMethod.CASH,
            userId,
            total: totalAmount,
            status: statusState.PENDING
        });

        const savedSale = await this.saleRepository.save(sale);

        // Create sale items and update product stock
        for (const validatedItem of validatedItems) {
            // Create sale item
            const salesItem = this.salesItemsRepository.create({
                saleId: savedSale.id,
                productId: validatedItem.productId,
                quantity: validatedItem.quantity,
                unitPrice: validatedItem.unitPrice,
                total: validatedItem.total
            });
            
            await this.salesItemsRepository.save(salesItem);

            // Update product stock
            validatedItem.product.stock -= validatedItem.quantity;
            await this.productsRepository.save(validatedItem.product);
        }

        // Log the sale creation
        await this.auditService.logUserActivity(
            currentUser,
            'SALE_CREATED',
            'sale',
            savedSale.id,
            {
                saleId: savedSale.id,
                customerId: savedSale.customerId,
                total: savedSale.total,
                itemCount: items.length,
                paymentMethod: savedSale.paymentMethod
            }
        );

        // Return sale with relationships
        return await this.getSaleById(savedSale.id);
    }

    async getSales(currentUser: User): Promise<Sale[]> {
        // Log the sales access
        await this.auditService.logUserActivity(
            currentUser,
            'SALES_LIST_VIEWED',
            'sale',
            undefined,
            { role: currentUser.role }
        );

        let salesQuery = this.saleRepository
            .createQueryBuilder('sale')
            .leftJoinAndSelect('sale.customer', 'customer')
            .leftJoinAndSelect('sale.user', 'user')
            .leftJoinAndSelect('sale.salesItems', 'salesItems')
            .leftJoinAndSelect('salesItems.product', 'product')
            .orderBy('sale.createdAt', 'DESC');

        // Cashiers can only see their own sales
        if (currentUser.role === 'cashier') {
            salesQuery = salesQuery.where('sale.userId = :userId', { userId: currentUser.id });
        }

        return await salesQuery.getMany();
    }

    async getSaleById(id: number, currentUser?: User): Promise<Sale> {
        const sale = await this.saleRepository.findOne({ 
            where: { id },
            relations: ['customer', 'user', 'salesItems', 'salesItems.product']
        });
        
        if (!sale) {
            throw new NotFoundException("Sale not found!");
        }

        // Cashiers can only view their own sales
        if (currentUser?.role === 'cashier' && sale.userId !== currentUser.id) {
            throw new ForbiddenException('You can only view your own sales');
        }

        // Log the sale view
        if (currentUser) {
            await this.auditService.logUserActivity(
                currentUser,
                'SALE_VIEWED',
                'sale',
                sale.id,
                { saleId: sale.id, viewedUserId: sale.userId }
            );
        }

        return sale;
    }

    async updateSale(id: number, updateSaleDto: UpdateSaleDto, currentUser?: User): Promise<Sale> {
        const sale = await this.saleRepository.findOne({ 
            where: { id },
            relations: ['customer', 'user', 'salesItems', 'salesItems.product']
        });
        
        if (!sale) {
            throw new NotFoundException("Sale not found!");
        }

        // Cashiers can only update their own sales and only if they're still pending
        if (currentUser?.role === 'cashier') {
            if (sale.userId !== currentUser.id) {
                throw new ForbiddenException('You can only update your own sales');
            }
            if (sale.status === 'completed') {
                throw new ForbiddenException('Cannot update completed sales');
            }
        }

        // Managers can update any sale but only if it's pending
        if (currentUser?.role === 'manager' && sale.status === 'completed') {
            throw new ForbiddenException('Cannot update completed sales');
        }

        const { customerId, paymentMethod, userId, status } = updateSaleDto;
        
        const oldValues = {
            customerId: sale.customerId,
            paymentMethod: sale.paymentMethod,
            userId: sale.userId,
            status: sale.status
        };

        // Validate customer exists if provided
        if (customerId) {
            const customer = await this.customerService.getCustomerById(customerId);
            if (!customer) {
                throw new NotFoundException("Customer not found!");
            }
            sale.customerId = customerId;
        }

        // Validate user exists if provided
        if (userId) {
            const user = await this.userService.getUserById(userId);
            if (!user) {
                throw new NotFoundException("User not found!");
            }
            sale.userId = userId;
        }

        // Handle status changes and inventory updates
        if (status === 'completed' && sale.status !== 'completed') {
            for (const item of sale.salesItems) {
                const product = item.product;
                product.stock -= item.quantity;
                await this.saleRepository.manager.save(product);
            }
            sale.status = status;
        }
        
        if (status === 'pending' && sale.status === 'completed') {
            for (const item of sale.salesItems) {
                const product = item.product;
                product.stock += item.quantity;
                await this.saleRepository.manager.save(product);
            }
            sale.status = status;
        }
        
        sale.paymentMethod = paymentMethod || sale.paymentMethod;
        sale.status = status || sale.status;

        const updatedSale = await this.saleRepository.save(sale);

        // Log the sale update
        if (currentUser) {
            await this.auditService.logUserActivity(
                currentUser,
                'SALE_UPDATED',
                'sale',
                updatedSale.id,
                { 
                    saleId: updatedSale.id,
                    oldValues,
                    newValues: { customerId, paymentMethod, userId, status },
                    updatedBy: currentUser.id
                }
            );
        }

        return updatedSale;
    }
    async updateSaleTotal(id:number, total:number): Promise<Sale> {
        const sale = await this.saleRepository.findOne({ where: { id } });
        if(!sale){
            throw new NotFoundException("Sale not found!")
        }
        if(total < 0) {
            throw new NotFoundException("Total must be greater than or equal to zero!")
        }
        sale.total = total;
        return this.saleRepository.save(sale);
    }

    async delete(id: number, currentUser?: User): Promise<{}> {
        const sale = await this.saleRepository.findOne({ 
            where: { id },
            relations: ['customer', 'user', 'salesItems', 'salesItems.product']
        });
        
        if (!sale) {
            throw new NotFoundException("Sale not found!");
        }

        // Only admins can delete sales, cashiers and managers cannot delete
        if (currentUser?.role !== 'admin') {
            throw new ForbiddenException('Only administrators can delete sales');
        }

        // If sale was completed, restore inventory
        if (sale.status === 'completed') {
            for (const item of sale.salesItems) {
                const product = item.product;
                product.stock += item.quantity;
                await this.saleRepository.manager.save(product);
            }
        }

        const saleData = {
            id: sale.id,
            total: sale.total,
            customerId: sale.customerId,
            userId: sale.userId,
            status: sale.status,
            paymentMethod: sale.paymentMethod
        };

        await this.saleRepository.delete(id);

        // Log the sale deletion
        if (currentUser) {
            await this.auditService.logUserActivity(
                currentUser,
                'SALE_DELETED',
                'sale',
                id,
                { 
                    deletedSale: saleData,
                    deletedBy: currentUser.id,
                    inventoryRestored: sale.status === 'completed'
                }
            );
        }

        return { "success": "Sale deleted successfully!" };
    }

    // Bulk Operations
    async bulkUpdateSalesStatus(saleIds: number[], status: string, currentUser?: User): Promise<{ updated: number, failed: number }> {
        let updated = 0;
        let failed = 0;

        for (const id of saleIds) {
            try {
                await this.updateSale(id, { status } as UpdateSaleDto, currentUser);
                updated++;
            } catch (error) {
                failed++;
            }
        }

        if (currentUser) {
            await this.auditService.logUserActivity(
                currentUser,
                'BULK_SALES_UPDATE',
                'sale',
                undefined,
                { saleIds, status, updated, failed }
            );
        }

        return { updated, failed };
    }

    async getSalesByDateRange(startDate: Date, endDate: Date, currentUser?: User): Promise<Sale[]> {
        const query = this.saleRepository.createQueryBuilder('sale')
            .leftJoinAndSelect('sale.customer', 'customer')
            .leftJoinAndSelect('sale.user', 'user')
            .leftJoinAndSelect('sale.salesItems', 'salesItems')
            .leftJoinAndSelect('salesItems.product', 'product')
            .where('sale.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });

        // Apply role-based filtering
        if (currentUser?.role === 'cashier') {
            query.andWhere('sale.userId = :userId', { userId: currentUser.id });
        }

        const sales = await query.orderBy('sale.createdAt', 'DESC').getMany();

        if (currentUser) {
            await this.auditService.logUserActivity(
                currentUser,
                'SALES_DATE_RANGE_QUERY',
                'sale',
                undefined,
                { startDate, endDate, resultCount: sales.length }
            );
        }

        return sales;
    }

    // Analytics
    async getSalesAnalytics(currentUser?: User): Promise<any> {
        const baseQuery = this.saleRepository.createQueryBuilder('sale')
            .leftJoinAndSelect('sale.salesItems', 'salesItems')
            .leftJoinAndSelect('salesItems.product', 'product');

        // Apply role-based filtering
        if (currentUser?.role === 'cashier') {
            baseQuery.andWhere('sale.userId = :userId', { userId: currentUser.id });
        }

        const [totalSales, completedSales, pendingSales] = await Promise.all([
            baseQuery.clone().getCount(),
            baseQuery.clone().andWhere('sale.status = :status', { status: 'completed' }).getCount(),
            baseQuery.clone().andWhere('sale.status = :status', { status: 'pending' }).getCount()
        ]);

        const totalRevenue = await baseQuery.clone()
            .andWhere('sale.status = :status', { status: 'completed' })
            .select('SUM(sale.total)', 'total')
            .getRawOne();

        const topProducts = await this.saleRepository.createQueryBuilder('sale')
            .leftJoin('sale.salesItems', 'salesItems')
            .leftJoin('salesItems.product', 'product')
            .select('product.name', 'productName')
            .addSelect('SUM(salesItems.quantity)', 'totalSold')
            .addSelect('SUM(salesItems.quantity * salesItems.unitPrice)', 'totalRevenue')
            .where('sale.status = :status', { status: 'completed' })
            .groupBy('product.id, product.name')
            .orderBy('totalSold', 'DESC')
            .limit(10)
            .getRawMany();

        const analytics = {
            totalSales,
            completedSales,
            pendingSales,
            totalRevenue: parseFloat(totalRevenue?.total || '0'),
            topProducts,
            completionRate: totalSales > 0 ? (completedSales / totalSales * 100).toFixed(2) : '0'
        };

        if (currentUser) {
            await this.auditService.logUserActivity(
                currentUser,
                'SALES_ANALYTICS_VIEWED',
                'sale',
                undefined,
                { analyticsGenerated: true, role: currentUser.role }
            );
        }

        return analytics;
    }

    async validatePaymentAmount(saleId: number, paymentAmount: number, currentUser?: User): Promise<{ valid: boolean, change?: number, message?: string }> {
        const sale = await this.getSaleById(saleId, currentUser);
        
        if (sale.status === 'completed') {
            return { valid: false, message: 'Sale is already completed' };
        }

        if (paymentAmount < sale.total) {
            return { valid: false, message: `Insufficient payment. Required: $${sale.total}, Received: $${paymentAmount}` };
        }

        const change = paymentAmount - sale.total;
        return { valid: true, change, message: change > 0 ? `Payment accepted. Change: $${change.toFixed(2)}` : 'Payment accepted. No change required.' };
    }

    async getCustomerSalesHistory(customerId: number, currentUser?: User): Promise<Sale[]> {
        // Verify customer exists
        const customer = await this.customerService.getCustomerById(customerId);
        if (!customer) {
            throw new NotFoundException('Customer not found');
        }

        const query = this.saleRepository.createQueryBuilder('sale')
            .leftJoinAndSelect('sale.user', 'user')
            .leftJoinAndSelect('sale.salesItems', 'salesItems')
            .leftJoinAndSelect('salesItems.product', 'product')
            .where('sale.customerId = :customerId', { customerId });

        // Apply role-based filtering
        if (currentUser?.role === 'cashier') {
            query.andWhere('sale.userId = :userId', { userId: currentUser.id });
        }

        const sales = await query.orderBy('sale.createdAt', 'DESC').getMany();

        if (currentUser) {
            await this.auditService.logUserActivity(
                currentUser,
                'CUSTOMER_SALES_HISTORY_VIEWED',
                'sale',
                undefined,
                { customerId, salesCount: sales.length }
            );
        }

        return sales;
    }

    // Advanced Reporting & Statistics
    async getDailySalesReport(date: Date, currentUser?: User): Promise<any> {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const query = this.saleRepository.createQueryBuilder('sale')
            .leftJoinAndSelect('sale.salesItems', 'salesItems')
            .leftJoinAndSelect('salesItems.product', 'product')
            .leftJoinAndSelect('sale.user', 'user')
            .where('sale.createdAt BETWEEN :startOfDay AND :endOfDay', { startOfDay, endOfDay });

        // Apply role-based filtering
        if (currentUser?.role === 'cashier') {
            query.andWhere('sale.userId = :userId', { userId: currentUser.id });
        }

        const sales = await query.getMany();
        
        const report = {
            date: date.toISOString().split('T')[0],
            totalSales: sales.length,
            completedSales: sales.filter(s => s.status === 'completed').length,
            pendingSales: sales.filter(s => s.status === 'pending').length,
            totalRevenue: sales
                .filter(s => s.status === 'completed')
                .reduce((sum, sale) => sum + parseFloat(sale.total.toString()), 0),
            paymentMethods: {
                cash: sales.filter(s => s.paymentMethod === 'cash').length,
                card: sales.filter(s => s.paymentMethod === 'card').length,
                mixed: sales.filter(s => s.paymentMethod === 'mixed').length
            },
            hourlyBreakdown: this.getHourlyBreakdown(sales),
            topSellingProducts: this.getTopSellingProducts(sales)
        };

        if (currentUser) {
            await this.auditService.logUserActivity(
                currentUser,
                'DAILY_SALES_REPORT_GENERATED',
                'sale',
                undefined,
                { reportDate: date, totalSales: report.totalSales }
            );
        }

        return report;
    }

    private getHourlyBreakdown(sales: any[]): any[] {
        const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
            hour: `${hour.toString().padStart(2, '0')}:00`,
            sales: 0,
            revenue: 0
        }));

        sales.forEach(sale => {
            const hour = new Date(sale.createdAt).getHours();
            hourlyData[hour].sales++;
            if (sale.status === 'completed') {
                hourlyData[hour].revenue += parseFloat(sale.total.toString());
            }
        });

        return hourlyData.filter(data => data.sales > 0);
    }

    private getTopSellingProducts(sales: any[]): any[] {
        const productStats: { [key: string]: { name: string, quantity: number, revenue: number } } = {};

        sales.forEach(sale => {
            if (sale.status === 'completed') {
                sale.salesItems.forEach((item: any) => {
                    const productId = item.product.id;
                    if (!productStats[productId]) {
                        productStats[productId] = {
                            name: item.product.name,
                            quantity: 0,
                            revenue: 0
                        };
                    }
                    productStats[productId].quantity += item.quantity;
                    productStats[productId].revenue += item.quantity * item.unitPrice;
                });
            }
        });

        return Object.values(productStats)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 10);
    }

    async getSalesTrends(days: number = 30, currentUser?: User): Promise<any> {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const query = this.saleRepository.createQueryBuilder('sale')
            .select('DATE(sale.createdAt)', 'date')
            .addSelect('COUNT(*)', 'totalSales')
            .addSelect('SUM(CASE WHEN sale.status = \'completed\' THEN 1 ELSE 0 END)', 'completedSales')
            .addSelect('SUM(CASE WHEN sale.status = \'completed\' THEN sale.total ELSE 0 END)', 'revenue')
            .where('sale.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
            .groupBy('DATE(sale.createdAt)')
            .orderBy('DATE(sale.createdAt)', 'DESC');

        // Apply role-based filtering
        if (currentUser?.role === 'cashier') {
            query.andWhere('sale.userId = :userId', { userId: currentUser.id });
        }

        const trends = await query.getRawMany();

        if (currentUser) {
            await this.auditService.logUserActivity(
                currentUser,
                'SALES_TRENDS_VIEWED',
                'sale',
                undefined,
                { days, trendsCount: trends.length }
            );
        }

        return {
            period: `${days} days`,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            trends: trends.map(trend => ({
                date: trend.date,
                totalSales: parseInt(trend.totalSales),
                completedSales: parseInt(trend.completedSales),
                revenue: parseFloat(trend.revenue || '0')
            }))
        };
    }

    async getTopCustomers(limit: number = 10, currentUser?: User): Promise<any> {
        const query = this.saleRepository.createQueryBuilder('sale')
            .leftJoin('sale.customer', 'customer')
            .select('customer.id', 'customerId')
            .addSelect('customer.name', 'customerName')
            .addSelect('COUNT(sale.id)', 'totalOrders')
            .addSelect('SUM(CASE WHEN sale.status = \'completed\' THEN sale.total ELSE 0 END)', 'totalSpent')
            .addSelect('AVG(CASE WHEN sale.status = \'completed\' THEN sale.total ELSE NULL END)', 'averageOrderValue')
            .where('sale.customerId IS NOT NULL')
            .andWhere('sale.status = :status', { status: 'completed' })
            .groupBy('customer.id, customer.name')
            .orderBy('totalSpent', 'DESC')
            .limit(limit);

        // Apply role-based filtering
        if (currentUser?.role === 'cashier') {
            query.andWhere('sale.userId = :userId', { userId: currentUser.id });
        }

        const topCustomers = await query.getRawMany();

        if (currentUser) {
            await this.auditService.logUserActivity(
                currentUser,
                'TOP_CUSTOMERS_VIEWED',
                'sale',
                undefined,
                { limit, customersCount: topCustomers.length }
            );
        }

        return topCustomers.map(customer => ({
            customerId: customer.customerId,
            customerName: customer.customerName,
            totalOrders: parseInt(customer.totalOrders),
            totalSpent: parseFloat(customer.totalSpent),
            averageOrderValue: parseFloat(customer.averageOrderValue || '0')
        }));
    }
}
