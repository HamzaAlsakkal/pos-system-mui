import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Sale } from "./entities/sale.entity";
import { SalesItems } from "src/sales_items/entities/salesItems.entity";
import { Products } from "src/product/entities/product.entity";
import { SaleController } from "./sale.controller";
import { SaleService } from "./sale.services";
import { UserModule } from "src/users/user.module";
import { CustomerModule } from "src/customers/customer.module";
import { AuditModule } from "src/audit/audit.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Sale, SalesItems, Products]), 
        UserModule, 
        CustomerModule,
        AuditModule
    ],
    controllers: [SaleController],
    providers: [SaleService],
    exports:[SaleService]
})
export class SaleModule {}