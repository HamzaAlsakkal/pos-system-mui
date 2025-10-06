import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Req } from "@nestjs/common";
import { CreateSaleDto } from "./dto/create-sale.dto";
import { UpdateSaleDto } from "./dto/update-sale.dto";
import { BulkUpdateStatusDto } from "./dto/bulk-update-status.dto";
import { ValidatePaymentDto } from "./dto/validate-payment.dto";
import { SaleService } from "./sale.services";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/entities/user.entity";
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('sales')
@ApiBearerAuth()
@Controller('sales')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SaleController {
    constructor( private readonly saleService: SaleService ) {}
    
    @Post()
    @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER)
    @ApiOperation({ summary: 'Create a new sale' })
    @ApiResponse({ status: 201, description: 'Sale created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiResponse({ status: 403, description: 'Insufficient permissions' })
    create(@Body() createSaleDto: CreateSaleDto, @Req() req: any) {
        return this.saleService.createSale(createSaleDto, req.user);
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER)
    @ApiOperation({ summary: 'Get all sales with role-based filtering' })
    @ApiResponse({ status: 200, description: 'Sales retrieved successfully' })
    findAll(@Req() req: any) {
        return this.saleService.getSales(req.user);
    }
    
    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER)
    @ApiOperation({ summary: 'Get a specific sale by ID' })
    @ApiResponse({ status: 200, description: 'Sale retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Sale not found' })
    @ApiResponse({ status: 403, description: 'Insufficient permissions' })
    findOne(@Param('id') id: number, @Req() req: any) {
        return this.saleService.getSaleById(id, req.user);
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER)
    @ApiOperation({ summary: 'Update a sale' })
    @ApiResponse({ status: 200, description: 'Sale updated successfully' })
    @ApiResponse({ status: 404, description: 'Sale not found' })
    @ApiResponse({ status: 403, description: 'Insufficient permissions' })
    update(@Param('id') id: number, @Body() updateSaleDto: UpdateSaleDto, @Req() req: any) {
        return this.saleService.updateSale(id, updateSaleDto, req.user);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Delete a sale (admin only)' })
    @ApiResponse({ status: 200, description: 'Sale deleted successfully' })
    @ApiResponse({ status: 404, description: 'Sale not found' })
    @ApiResponse({ status: 403, description: 'Insufficient permissions' })
    remove(@Param('id') id: number, @Req() req: any) {
        return this.saleService.delete(id, req.user);
    }

    @Post('bulk-update-status')
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @ApiOperation({ summary: 'Bulk update sales status' })
    @ApiResponse({ status: 200, description: 'Bulk update completed' })
    bulkUpdateStatus(@Body() bulkUpdateDto: BulkUpdateStatusDto, @Req() req: any) {
        return this.saleService.bulkUpdateSalesStatus(bulkUpdateDto.saleIds, bulkUpdateDto.status, req.user);
    }

    @Get('analytics/summary')
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @ApiOperation({ summary: 'Get sales analytics summary' })
    @ApiResponse({ status: 200, description: 'Analytics retrieved successfully' })
    getAnalytics(@Req() req: any) {
        return this.saleService.getSalesAnalytics(req.user);
    }

    @Get('date-range/:startDate/:endDate')
    @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER)
    @ApiOperation({ summary: 'Get sales within date range' })
    @ApiResponse({ status: 200, description: 'Sales retrieved successfully' })
    getSalesByDateRange(
        @Param('startDate') startDate: string,
        @Param('endDate') endDate: string,
        @Req() req: any
    ) {
        return this.saleService.getSalesByDateRange(
            new Date(startDate),
            new Date(endDate),
            req.user
        );
    }

    @Post('validate-payment/:id')
    @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER)
    @ApiOperation({ summary: 'Validate payment amount for a sale' })
    @ApiResponse({ status: 200, description: 'Payment validation result' })
    validatePayment(
        @Param('id') id: number,
        @Body() validatePaymentDto: ValidatePaymentDto,
        @Req() req: any
    ) {
        return this.saleService.validatePaymentAmount(id, validatePaymentDto.paymentAmount, req.user);
    }

    @Get('customer/:customerId/history')
    @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER)
    @ApiOperation({ summary: 'Get customer sales history' })
    @ApiResponse({ status: 200, description: 'Customer sales history retrieved' })
    @ApiResponse({ status: 404, description: 'Customer not found' })
    getCustomerSalesHistory(@Param('customerId') customerId: number, @Req() req: any) {
        return this.saleService.getCustomerSalesHistory(customerId, req.user);
    }

    @Get('reports/daily/:date')
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @ApiOperation({ summary: 'Get daily sales report' })
    @ApiResponse({ status: 200, description: 'Daily sales report generated' })
    getDailySalesReport(@Param('date') date: string, @Req() req: any) {
        return this.saleService.getDailySalesReport(new Date(date), req.user);
    }

    @Get('reports/trends/:days')
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @ApiOperation({ summary: 'Get sales trends for specified number of days' })
    @ApiResponse({ status: 200, description: 'Sales trends retrieved' })
    getSalesTrends(@Param('days') days: number, @Req() req: any) {
        return this.saleService.getSalesTrends(days, req.user);
    }

    @Get('reports/top-customers/:limit')
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @ApiOperation({ summary: 'Get top customers by spending' })
    @ApiResponse({ status: 200, description: 'Top customers retrieved' })
    getTopCustomers(@Param('limit') limit: number, @Req() req: any) {
        return this.saleService.getTopCustomers(limit, req.user);
    }
}