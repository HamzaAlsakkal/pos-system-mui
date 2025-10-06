import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Patch
} from '@nestjs/common';
import { ProductService } from './product.services';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class CategoriesController{
    constructor(private readonly productService: ProductService){}
    
    @Post()
    async create(@Body() createProductDto:CreateProductDto){
        return this.productService.create(createProductDto)
    }
    
    @Get()
    async getAll(){
        return this.productService.getAll()
    }

    @Get(':id')
    async getById(@Param('id') id:number){
        return this.productService.getById(id)
    }

    @Patch(':id')
    async update(@Param('id') id:number, @Body() updateProductDto:UpdateProductDto){
        return this.productService.update(id, updateProductDto)
    }
    
    @Delete(':id')
    async delete(@Param('id') id:number){
        return this.productService.delate(id)
    }
}
