import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { DashboardSummaryDto } from './dto/dashboard-summary.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @ApiOperation({ 
    summary: 'Get dashboard summary',
    description: 'Retrieve comprehensive dashboard statistics and metrics'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Dashboard summary retrieved successfully',
    type: DashboardSummaryDto
  })
  @ApiUnauthorizedResponse({ 
    description: 'Unauthorized - Invalid or missing token' 
  })
  async getDashboardSummary(@CurrentUser() user: User): Promise<DashboardSummaryDto> {
    return await this.dashboardService.getDashboardSummary(user);
  }

  @Get('low-stock')
  @ApiOperation({ 
    summary: 'Get low stock products',
    description: 'Retrieve products with low stock levels'
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of products to return (default: 10)',
    example: 10
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Low stock products retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Product Name' },
          stock: { type: 'number', example: 5 },
          minimumStock: { type: 'number', example: 10 },
        }
      }
    }
  })
  @ApiUnauthorizedResponse({ 
    description: 'Unauthorized - Invalid or missing token' 
  })
  async getLowStockProducts(
    @CurrentUser() user: User,
    @Query('limit') limit?: string
  ) {
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return await this.dashboardService.getLowStockProducts(limitNumber, user);
  }

  @Get('top-products')
  @ApiOperation({ 
    summary: 'Get top selling products',
    description: 'Retrieve best selling products by quantity or revenue'
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of products to return (default: 10)',
    example: 10
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Top selling products retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Product Name' },
          quantitySold: { type: 'number', example: 25 },
          revenue: { type: 'number', example: 1250.00 },
        }
      }
    }
  })
  @ApiUnauthorizedResponse({ 
    description: 'Unauthorized - Invalid or missing token' 
  })
  async getTopSellingProducts(
    @CurrentUser() user: User,
    @Query('limit') limit?: string
  ) {
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return await this.dashboardService.getTopSellingProducts(limitNumber, user);
  }

  @Get('sales-analytics')
  @ApiOperation({ 
    summary: 'Get sales analytics',
    description: 'Retrieve sales analytics data for specified time period'
  })
  @ApiQuery({
    name: 'days',
    required: false,
    description: 'Number of days to analyze (default: 30)',
    example: 30
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Sales analytics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalSales: { type: 'number', example: 25000 },
        totalOrders: { type: 'number', example: 150 },
        averageOrderValue: { type: 'number', example: 166.67 },
        salesByDay: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              date: { type: 'string', example: '2023-10-03' },
              sales: { type: 'number', example: 1500 },
              orders: { type: 'number', example: 8 },
            }
          }
        }
      }
    }
  })
  @ApiUnauthorizedResponse({ 
    description: 'Unauthorized - Invalid or missing token' 
  })
  async getSalesAnalytics(
    @CurrentUser() user: User,
    @Query('days') days?: string
  ) {
    const daysNumber = days ? parseInt(days, 10) : 30;
    return await this.dashboardService.getSalesAnalytics(daysNumber, user);
  }
}