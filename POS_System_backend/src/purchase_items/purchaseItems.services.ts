import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { PurchaseItems } from "./entities/purchaseItems.entity";
import { CreatePurchaseItemsDto } from "./dto/create-purchaseItems.dto";
import { UpdatePurchaseItemsDto } from "./dto/update-purchaseItems.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductService } from "src/product/product.services";
import { PurchaseService } from "src/purchases/purchase.services";




@Injectable()
export class PurchaseItemsService {
    constructor(
        @InjectRepository(PurchaseItems)
        private readonly pItemsRepository: Repository<PurchaseItems>,
        private readonly productService: ProductService,
        private readonly purchaseService: PurchaseService
    ){}

    async createPurchaseItems(createPurchaseItemsDto:CreatePurchaseItemsDto): Promise<PurchaseItems> {
        const { productId, quantity, purchaseId, unitCost} = createPurchaseItemsDto;
        const purchaseItemsExists = await this.pItemsRepository.findOne({ where: { purchaseId, productId } });
        if(purchaseItemsExists){
            throw new NotFoundException("This product is already added to the purchase!")
        }
        const purchase = await this.purchaseService.getPurchasById(purchaseId);
        if(!purchase){
            throw new NotFoundException("Purchase not found!")
        }
        if(purchase.status === 'completed'){
            throw new NotFoundException("Cannot add items to a completed purchase!")
        }

        const product = await this.productService.getById(productId);
        if(!product){
            throw new NotFoundException("Product not found!")
        }

        if(quantity <= 0){
            throw new NotFoundException("Quantity must be greater than zero!")
        }

        if(unitCost <= 0){
            throw new NotFoundException("Unit cost must be greater than zero!")
        }
        
        let total = unitCost * quantity;
        await this.purchaseService.updatePurchasTotal(purchaseId,  +total );
        const purchaseItems = this.pItemsRepository.create({
            total,
            productId,
            quantity,
            purchaseId,
            unitCost
        });
        return this.pItemsRepository.save(purchaseItems);
    }

    async getPurchaseItems(): Promise<PurchaseItems[]> {
        return this.pItemsRepository.find();
    }

    async getPurchaseItemsById(id:number): Promise<PurchaseItems> {
        const purchaseItems = await this.pItemsRepository.findOne({ where: { id } });
        if(!purchaseItems){
            throw new NotFoundException("Purchase Items not found!")
        }
        return purchaseItems;
    }

    async updatePurchaseItems(id:number, updatePurchaseItemsDto:UpdatePurchaseItemsDto): Promise<PurchaseItems> {
        const purchaseItems = await this.pItemsRepository.findOne({ where: { id }, relations: ['purchase']});
        if(!purchaseItems){
            throw new NotFoundException("Purchase Items not found!")
        }
        if(purchaseItems.purchase.status === 'completed'){
            throw new NotFoundException("Cannot update items from a completed purchase!")
        }

        const { quantity, unitCost} = updatePurchaseItemsDto;

        let newQuantity = quantity ?? purchaseItems.quantity;
        let newUnitCost = unitCost ?? purchaseItems.unitCost;
        let newTotal = newQuantity * newUnitCost;
        await this.purchaseService.updatePurchasTotal(purchaseItems.purchaseId,  (+purchaseItems.purchase.total - purchaseItems.total) + newTotal );

        purchaseItems.total = newTotal;
        purchaseItems.quantity = newQuantity;
        purchaseItems.unitCost = newUnitCost;

        return this.pItemsRepository.save(purchaseItems);
    }

    async delete(id:number): Promise<{}> {
        const purchaseItems = await this.pItemsRepository.findOne({ where: { id }, relations: ['purchase']});
        if(!purchaseItems){
            throw new NotFoundException("Purchase Items not found!")
        }
        if(purchaseItems.purchase.status === 'completed'){
            throw new NotFoundException("Cannot delete items from a completed purchase!")
        }
        await this.purchaseService.updatePurchasTotal(purchaseItems.purchaseId,  +purchaseItems.purchase.total - purchaseItems.total );
        await this.pItemsRepository.delete(id);
        return {"success": "Purchase Items deleted successfully!"};
    }
}
