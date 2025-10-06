import { IsArray, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { statusState } from '../entities/sale.entity';

export class BulkUpdateStatusDto {
    @ApiProperty({ 
        example: [1, 2, 3], 
        description: 'Array of sale IDs to update',
        type: [Number]
    })
    @IsArray()
    @IsNumber({}, { each: true })
    saleIds: number[];

    @ApiProperty({ 
        enum: statusState, 
        example: statusState.COMPLETED, 
        description: 'New status for all selected sales' 
    })
    @IsEnum(statusState)
    status: statusState;
}