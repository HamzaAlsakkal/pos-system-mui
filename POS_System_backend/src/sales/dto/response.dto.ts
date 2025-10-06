import { ApiProperty } from '@nestjs/swagger';

export class SalesAnalyticsDto {
    @ApiProperty({ example: 150, description: 'Total number of sales' })
    totalSales: number;

    @ApiProperty({ example: 120, description: 'Number of completed sales' })
    completedSales: number;

    @ApiProperty({ example: 30, description: 'Number of pending sales' })
    pendingSales: number;

    @ApiProperty({ example: 15750.50, description: 'Total revenue from completed sales' })
    totalRevenue: number;

    @ApiProperty({ example: '80.00', description: 'Sales completion rate percentage' })
    completionRate: string;

    @ApiProperty({ 
        example: [
            { productName: 'Product A', totalSold: '45', totalRevenue: '2250.00' }
        ],
        description: 'Top 10 selling products'
    })
    topProducts: any[];
}

export class BulkUpdateResultDto {
    @ApiProperty({ example: 8, description: 'Number of successfully updated sales' })
    updated: number;

    @ApiProperty({ example: 2, description: 'Number of failed updates' })
    failed: number;
}

export class PaymentValidationDto {
    @ApiProperty({ example: true, description: 'Whether the payment is valid' })
    valid: boolean;

    @ApiProperty({ example: 5.50, description: 'Change amount (if any)', required: false })
    change?: number;

    @ApiProperty({ example: 'Payment accepted. Change: $5.50', description: 'Validation message' })
    message: string;
}