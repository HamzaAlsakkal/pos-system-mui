import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CreateSalesItemsDto } from "./dto/create-salesItems.dto";
import { UpdateSalesItemsDto } from "./dto/update-salesItems.dto";
import { SaleItemsService } from "./saleItems.services";


@Controller('sales-items')
export class SaleItemsController {
    constructor( private readonly saleService: SaleItemsService ) {}
    
    @Post()
    create(@Body() createSaleDto: CreateSalesItemsDto) {
        return this.saleService.createSaleItems(createSaleDto);
    }

    @Get()
    findAll() {
        return this.saleService.getSaleItems();
    }
    
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.saleService.getSaleItemsById(id);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() updateSaleDto: CreateSalesItemsDto) {
        return this.saleService.updateSaleItems(id, updateSaleDto);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.saleService.delete(id);
    }
}