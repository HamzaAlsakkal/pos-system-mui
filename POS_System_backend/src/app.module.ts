import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/user.module';
import { ProductsModule } from './product/product.module';
import { CategoryModule } from './categories/category.module';
import { PurchaseModule } from './purchases/purchase.module';
import { SaleItemsModule } from './sales_items/saleItems.module';
import { SaleModule } from './sales/sale.module';
import { CustomerModule } from './customers/customer.module';
import { SupplierModule } from './suppliers/supplier.module';
import { PurchaseItemsModule } from './purchase_items/purchaseItems.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER_NAME || 'postgres',
      password: process.env.DB_PASSWORD || 'your_password',
      database: process.env.DB_NAME || 'pos',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    CategoryModule,
    CustomerModule,
    ProductsModule,
    SupplierModule,
    SaleModule,
    SaleItemsModule,
    PurchaseModule,
    PurchaseItemsModule,
    AuthModule,
    DashboardModule,
    AuditModule
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
