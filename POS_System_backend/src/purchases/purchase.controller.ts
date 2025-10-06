import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CreatePurchasesDto } from "./dto/create-purchases.dto";
import { UpdatePurchasesDto } from "./dto/update-purchases.dto";
import { PurchaseService } from "./purchase.services";


@Controller('purchases')
export class PurchaseController {
    constructor( private readonly purchaseService: PurchaseService ) {}
    
    @Post()
    create(@Body() createPurchasesDto: CreatePurchasesDto) {
        return this.purchaseService.createSale(createPurchasesDto);
    }

    @Get()
    findAll() {
        return this.purchaseService.getPurchases();
    }
    
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.purchaseService.getPurchasById(id);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() updatePurchasesDto: UpdatePurchasesDto) {
        return this.purchaseService.updatePurchas(id, updatePurchasesDto);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.purchaseService.delete(id);
    }
}