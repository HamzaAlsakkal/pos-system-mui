import { IsNumber, IsOptional, IsString } from "class-validator";


export class CreatePurchasesDto {
    @IsNumber()
    userId: number;
    
    @IsNumber()
    supplierId: number;

    @IsString()
    @IsOptional()
    status?: string;
}