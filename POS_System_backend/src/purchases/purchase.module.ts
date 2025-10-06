import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Purchase } from "./entities/purchase.entity";
import { PurchaseController } from "./purchase.controller";
import { PurchaseService } from "./purchase.services";
import { SupplierModule } from "src/suppliers/supplier.module";
import { UserModule } from "src/users/user.module";



@Module({
    imports: [TypeOrmModule.forFeature([Purchase]), SupplierModule, UserModule],
    controllers: [PurchaseController],
    providers: [PurchaseService],
    exports: [PurchaseService]
})
export class PurchaseModule {}