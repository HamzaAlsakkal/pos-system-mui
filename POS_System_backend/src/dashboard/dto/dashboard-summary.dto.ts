import { ApiProperty } from '@nestjs/swagger';

class TrendDto {
  @ApiProperty({
    example: 15000,
    description: 'Current period value',
  })
  current: number;

  @ApiProperty({
    example: 12000,
    description: 'Previous period value',
  })
  previous: number;

  @ApiProperty({
    example: 25.5,
    description: 'Percentage change',
  })
  percentage: number;
}

class RecentSaleDto {
  @ApiProperty({
    example: 1,
    description: 'Sale ID',
  })
  id: number;

  @ApiProperty({
    example: 150.00,
    description: 'Sale total amount',
  })
  total: number;

  @ApiProperty({
    example: '2023-10-03T21:00:00.000Z',
    description: 'Sale date',
  })
  saleDate: Date;

  @ApiProperty({
    example: 'John Doe',
    description: 'Customer name',
  })
  customerName: string;
}

class TopProductDto {
  @ApiProperty({
    example: 1,
    description: 'Product ID',
  })
  id: number;

  @ApiProperty({
    example: 'Product Name',
    description: 'Product name',
  })
  name: string;

  @ApiProperty({
    example: 25,
    description: 'Quantity sold',
  })
  quantitySold: number;

  @ApiProperty({
    example: 1250.00,
    description: 'Total revenue from this product',
  })
  revenue: number;
}

class UserContextDto {
  @ApiProperty({
    example: 1,
    description: 'User ID',
  })
  userId: number;

  @ApiProperty({
    example: 'John Doe',
    description: 'User full name',
  })
  userName: string;

  @ApiProperty({
    example: 'admin',
    description: 'User role',
    enum: ['admin', 'manager', 'cashier'],
  })
  userRole: string;

  @ApiProperty({
    example: 15,
    description: 'Number of sales made by this user',
  })
  personalSalesCount: number;

  @ApiProperty({
    example: true,
    description: 'Whether user can view purchase data',
  })
  canViewPurchases: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether user can view all sales or only their own',
  })
  canViewAllSales: boolean;
}

export class DashboardSummaryDto {
  @ApiProperty({
    example: 25000,
    description: 'Total sales amount',
  })
  totalSales: number;

  @ApiProperty({
    example: 18000,
    description: 'Total purchases amount',
  })
  totalPurchases: number;

  @ApiProperty({
    example: 150,
    description: 'Total number of products',
  })
  totalProducts: number;

  @ApiProperty({
    example: 5,
    description: 'Number of products with low stock',
  })
  lowStockProducts: number;

  @ApiProperty({
    example: 75,
    description: 'Total number of customers',
  })
  totalCustomers: number;

  @ApiProperty({
    example: 12,
    description: 'Total number of suppliers',
  })
  totalSuppliers: number;

  @ApiProperty({
    type: [RecentSaleDto],
    description: 'List of recent sales',
  })
  recentSales: any[];

  @ApiProperty({
    type: [TopProductDto],
    description: 'List of top selling products',
  })
  topProducts: any[];

  @ApiProperty({
    type: TrendDto,
    description: 'Sales trend data',
    required: false,
  })
  salesTrend?: {
    current: number;
    previous: number;
    percentage: number;
  };

  @ApiProperty({
    type: TrendDto,
    description: 'Purchases trend data',
    required: false,
  })
  purchasesTrend?: {
    current: number;
    previous: number;
    percentage: number;
  };

  @ApiProperty({
    type: UserContextDto,
    description: 'User context and permissions',
  })
  userContext: {
    userId: number;
    userName: string;
    userRole: string;
    personalSalesCount: number;
    canViewPurchases: boolean;
    canViewAllSales: boolean;
  };
}