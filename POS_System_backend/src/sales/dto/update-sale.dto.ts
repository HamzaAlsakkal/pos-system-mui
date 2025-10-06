import { PartialType } from "@nestjs/mapped-types";
import { CreateSaleDto } from "./create-sale.dto";
import { IsEnum, IsOptional } from "class-validator";
import { statusState } from "../entities/sale.entity";
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSaleDto extends PartialType(CreateSaleDto) {
    @ApiProperty({ enum: statusState, example: statusState.COMPLETED, description: 'Sale status', required: false })
    @IsEnum(statusState)
    @IsOptional()
    status?: statusState;
}