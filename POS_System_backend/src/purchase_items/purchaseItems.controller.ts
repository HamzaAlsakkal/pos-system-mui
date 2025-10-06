import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CreatePurchaseItemsDto } from "./dto/create-purchaseItems.dto";
import { UpdatePurchaseItemsDto } from "./dto/update-purchaseItems.dto";
import { PurchaseItemsService } from "./purchaseItems.services";
import { UpdateSalesItemsDto } from "src/sales_items/dto/update-salesItems.dto";


@Controller('purchase-Items')
export class PurchaseItemsController {
    constructor( private readonly purchaseItemsService: PurchaseItemsService ) {}
    
    @Post()
    create(@Body() createPurchaseItemsDto: CreatePurchaseItemsDto) {
        return this.purchaseItemsService.createPurchaseItems(createPurchaseItemsDto);
    }

    @Get()
    findAll() {
        return this.purchaseItemsService.getPurchaseItems();
    }
    
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.purchaseItemsService.getPurchaseItemsById(id);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() updatePurchaseItemsDto: UpdatePurchaseItemsDto) {
        return this.purchaseItemsService.updatePurchaseItems(id, updatePurchaseItemsDto);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.purchaseItemsService.delete(id);
    }
}