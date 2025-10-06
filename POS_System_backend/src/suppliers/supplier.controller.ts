import { RolesGuard } from "src/auth/guards/roles.guard";
import { CreateSupplierDto } from "./dto/create-supplier.dto";
import { UpdateSupplierDto } from "./dto/update-supplier.dto";
import { Supplier } from "./entities/supplier.entity";
import { SupplierService } from "./supplier.services";
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole } from "src/users/entities/user.entity";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.MANAGER)
@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  createUser(@Body() createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    return this.supplierService.createSupplier(createSupplierDto);
  }
  @Get()
  getUsers(): Promise<Supplier[]> {
    return this.supplierService.getSuppliers();
  }
  @Get(':id')
  getUserById(@Param('id') id: number): Promise<Supplier> {
    return this.supplierService.getSupplierById(id);
  }
  @Put(':id')
  updateUser(@Param('id') id: number, @Body() updateSupplierDto: UpdateSupplierDto): Promise<Supplier> {
    return this.supplierService.updateSupplier(id, updateSupplierDto);
  }
  @Delete(':id')
  deleteUser(@Param('id') id: number): Promise<{}> {
    return this.supplierService.delete(id);
  }
}