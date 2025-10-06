import {
    IsInt,
    IsOptional,
    IsString,
} from 'class-validator'

export class CreateProductDto{
    @IsString()
    name:string;
    
    @IsString()
    @IsOptional()
    barcode:string

    @IsString()
    @IsOptional()
    categoryId:number

    @IsInt()
    price:number
    
    @IsString()
    @IsOptional()
    stock:number
    
};