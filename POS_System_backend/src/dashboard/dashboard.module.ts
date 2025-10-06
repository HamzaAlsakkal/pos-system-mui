import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { AuditModule } from '../audit/audit.module';
import { Sale } from '../sales/entities/sale.entity';
import { Products } from '../product/entities/product.entity';
import { Customer } from '../customers/entities/customer.entity';
import { Supplier } from '../suppliers/entities/supplier.entity';
import { Purchase } from '../purchases/entities/purchase.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Sale,
      Products,
      Customer,
      Supplier,
      Purchase
    ]),
    AuditModule
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService]
})
export class DashboardModule {}