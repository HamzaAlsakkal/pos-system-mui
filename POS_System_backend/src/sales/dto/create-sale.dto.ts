import { IsNumber, IsOptional, IsArray, ValidateNested, IsEnum, IsPositive } from "class-validator";
import { Type } from "class-transformer";
import { PaymentMethod } from "../entities/sale.entity";
import { ApiProperty } from '@nestjs/swagger';

class SaleItemDto {
    @ApiProperty({ example: 1, description: 'Product ID' })
    @IsNumber()
    productId: number;

    @ApiProperty({ example: 2, description: 'Quantity to purchase' })
    @IsNumber()
    @IsPositive()
    quantity: number;

    @ApiProperty({ example: 29.99, description: 'Unit price (optional, will use product price if not provided)', required: false })
    @IsNumber()
    @IsOptional()
    unitPrice?: number;
}

export class CreateSaleDto {
    @ApiProperty({ example: 1, description: 'User ID creating the sale' })
    @IsNumber()
    userId: number;
    
    @ApiProperty({ example: 1, description: 'Customer ID (optional for walk-in customers)', required: false })
    @IsNumber()
    @IsOptional()
    customerId?: number;

    @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.CASH, description: 'Payment method', required: false })
    @IsEnum(PaymentMethod)
    @IsOptional()
    paymentMethod?: PaymentMethod;

    @ApiProperty({ type: [SaleItemDto], description: 'Array of items being sold' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SaleItemDto)
    items: SaleItemDto[];
}