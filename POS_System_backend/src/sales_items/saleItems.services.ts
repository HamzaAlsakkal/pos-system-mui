import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { SalesItems } from "./entities/salesItems.entity";
import { CreateSalesItemsDto } from "./dto/create-salesItems.dto";
import { UpdateSalesItemsDto } from "./dto/update-salesItems.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductService } from "src/product/product.services";
import { SaleService } from "src/sales/sale.services";




@Injectable()
export class SaleItemsService {
    constructor(
        @InjectRepository(SalesItems)
        private readonly sItemsRepository: Repository<SalesItems>,
        private readonly saleService: SaleService,
        private readonly productService: ProductService
    ){}

    async createSaleItems(createSalesItemsDto:CreateSalesItemsDto): Promise<SalesItems> {
        const { productId, quantity, saleId } = createSalesItemsDto;
        const sale = await this.saleService.getSaleById(saleId);
        const saleItemsExists = await this.sItemsRepository.findOne({ where: { saleId, productId } });
        if(saleItemsExists){
            throw new NotFoundException("This product is already added to the sale!")
        }

        if(!sale){
            throw new NotFoundException("Sale not found!")
        }

        if(sale.status === 'completed'){
            throw new NotFoundException("Cannot add items to a completed sale!")
        }

        const product = await this.productService.getById(productId);
        if(!product){
            throw new NotFoundException("Product not found!")
        }

        if(quantity <= 0){
            throw new NotFoundException("Quantity must be greater than zero!")
        }

        if(quantity > product.stock){
            throw new NotFoundException("Insufficient stock!")
        }
        
        const unitPrice = +product.price;
        let total = unitPrice * quantity;
        await this.saleService.updateSaleTotal(saleId,  +sale.total + total );
        const saleItems = this.sItemsRepository.create({
            total,
            productId,
            quantity,
            saleId,
            unitPrice,
        });
        return this.sItemsRepository.save(saleItems);
    }

    async getSaleItems(): Promise<SalesItems[]> {
        return this.sItemsRepository.find();
    }

    async getSaleItemsById(id:number): Promise<SalesItems> {
        const saleItems = await this.sItemsRepository.findOne({ where: { id } });
        if(!saleItems){
            throw new NotFoundException("Sale Items not found!")
        }
        return saleItems;
    }

    async updateSaleItems(id:number, updateSaleItemsDto:UpdateSalesItemsDto): Promise<SalesItems> {
        const saleItems = await this.sItemsRepository.findOne({ where: { id }, relations: ['sale']});
        if(!saleItems){
            throw new NotFoundException("Sale Items not found!")
        }
        if(saleItems.sale.status === 'completed'){
            throw new NotFoundException("Cannot update items from a completed sale!")
        }
        const { quantity } = updateSaleItemsDto;
        if(!quantity){
            return saleItems;
        }

        const product = await this.productService.getById(saleItems.productId);
        if(quantity <= 0){
        throw new NotFoundException("Quantity must be greater than zero!")
        }
        if(quantity > product.stock + saleItems.quantity){
            throw new NotFoundException("Insufficient stock!")
        }

        const newTotal = quantity * saleItems.unitPrice;
        const sale = await this.saleService.getSaleById(saleItems.saleId);
        const total = +sale.total - +saleItems.total + newTotal;
        await this.saleService.updateSaleTotal(saleItems.saleId, total);

        saleItems.total = newTotal;
        saleItems.quantity = quantity;

        return this.sItemsRepository.save(saleItems);
    }

    async delete(id:number): Promise<{}> {
        const saleItems = await this.sItemsRepository.findOne({ where: { id } , relations: ['sale']});
        if(!saleItems){
            throw new NotFoundException("Sale Items not found!")
        }

        if(saleItems.sale.status === 'completed'){
            throw new NotFoundException("Cannot delete items from a completed sale!")
        }

        const oldTotal = saleItems.unitPrice * saleItems.quantity;
        const sale = await this.saleService.getSaleById(saleItems.saleId);
        await this.saleService.updateSaleTotal(saleItems.saleId, +sale.total - oldTotal);

        await this.sItemsRepository.delete(id);
        return {"success": "Sale Items deleted successfully!"};
    }
}
