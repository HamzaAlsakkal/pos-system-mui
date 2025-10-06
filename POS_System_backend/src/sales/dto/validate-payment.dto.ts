import { IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidatePaymentDto {
    @ApiProperty({ 
        example: 125.50, 
        description: 'Payment amount received from customer' 
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    paymentAmount: number;
}