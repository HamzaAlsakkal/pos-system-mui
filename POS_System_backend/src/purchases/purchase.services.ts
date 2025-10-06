import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { CreatePurchasesDto } from "./dto/create-purchases.dto";
import { Purchase } from "./entities/purchase.entity";
import { UpdatePurchasesDto } from "./dto/update-purchases.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserService } from "src/users/user.services";
import { SupplierService } from "src/suppliers/supplier.services";




@Injectable()
export class PurchaseService {
    constructor(
        @InjectRepository(Purchase)
        private readonly purchasesRepository: Repository<Purchase>,
        private readonly supplierService: SupplierService,
        private readonly userService: UserService
    ){}

    async createSale(createPurchasesDto:CreatePurchasesDto): Promise<Purchase> {
        const { supplierId, userId} = createPurchasesDto;
        const user = await this.userService.getUserById(userId);
        if(!user){
            throw new NotFoundException("User not found!")
        }
        const supplier = await this.supplierService.getSupplierById(supplierId);
        if(!supplier){
            throw new NotFoundException("Supplier not found!")
        }
        const purchases = this.purchasesRepository.create({
            supplierId,
            userId
        });
        return this.purchasesRepository.save(purchases);
    }

    async getPurchases(): Promise<Purchase[]> {
        return this.purchasesRepository.find();
    }

    async getPurchasById(id:number): Promise<Purchase> {
        const purchas = await this.purchasesRepository.findOne({ where: { id } });
        if(!purchas){
            throw new NotFoundException("Purchas not found!")
        }
        return purchas;
    }

    async updatePurchas(id:number, updatePurchasesDto:UpdatePurchasesDto): Promise<Purchase> {
        const purchas = await this.purchasesRepository.findOne({ where: { id } });
        if(!purchas){
            throw new NotFoundException("Purchas not found!")
        }
        const { userId, supplierId, status } = updatePurchasesDto;
        if(supplierId){
            const supplier = await this.supplierService.getSupplierById(supplierId);
            if(!supplier){
                throw new NotFoundException("Supplier not found!")
            }
            purchas.supplierId = supplierId
        }
        if(userId){
            const user = await this.userService.getUserById(userId);
            if(!user){
                throw new NotFoundException("User not found!")
            }
            purchas.userId = userId
        }
        if(status === 'completed' && purchas.status !== 'completed'){
            const updatedPurchas = await this.purchasesRepository.findOne({ where: { id }, relations: ['purchaseItems', 'purchaseItems.product'] });
            if(!updatedPurchas){
                throw new NotFoundException("Purchas not found!")
            }
            for (const item of updatedPurchas.purchaseItems) {
                const product = item.product;
                product.stock += item.quantity;
                await this.purchasesRepository.manager.save(product);
            }
        }
        if(status === 'pending' && purchas.status === 'completed'){
            const updatedPurchas = await this.purchasesRepository.findOne({ where: { id }, relations: ['purchaseItems', 'purchaseItems.product'] });
            if(!updatedPurchas){
                throw new NotFoundException("Purchas not found!")
            }
            for (const item of updatedPurchas.purchaseItems) {
                const product = item.product;
                product.stock -= item.quantity;
                await this.purchasesRepository.manager.save(product);
            }
        }
        purchas.status = status || purchas.status
        return this.purchasesRepository.save(purchas);
    }

    async updatePurchasTotal(id:number, total:number): Promise<Purchase> {
        const purchas = await this.purchasesRepository.findOne({ where: { id } });
        if(!purchas){
            throw new NotFoundException("Purchas not found!")
        }
        if(total < 0) {
            throw new NotFoundException("Total must be greater than or equal to zero!")
        }
        purchas.total = total;
        return this.purchasesRepository.save(purchas);
    }
    async delete(id:number): Promise<{}> {
        const purchas = await this.purchasesRepository.findOne({ where: { id }, relations: ['purchaseItems', 'purchaseItems.product'] });
        if(!purchas){
            throw new NotFoundException("Purchas not found!")
        }
        await this.purchasesRepository.delete(id);
        return {"success": "Purchas deleted successfully!"};
    }
}
