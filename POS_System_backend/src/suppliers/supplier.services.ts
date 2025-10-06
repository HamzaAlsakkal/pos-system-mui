import { Repository } from "typeorm";
import { Supplier } from "./entities/supplier.entity";
import { CreateSupplierDto } from "./dto/create-supplier.dto";
import { UpdateSupplierDto } from "./dto/update-supplier.dto";
import { BadRequestException, Inject, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  async createSupplier(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    const { name, phone, email, address} = createSupplierDto;
    const supplierExists = await this.supplierRepository.findOne({ where: { phone } });
    if (supplierExists) {
      throw new BadRequestException('Phone already exists');
    }
    const emailExists = await this.supplierRepository.findOne({ where: { email } });
    if (emailExists) {
      throw new BadRequestException('Email already exists');
    }
    const supplier = this.supplierRepository.create({
      name,
      phone,
      email,
      address,
    });
    return this.supplierRepository.save(supplier);
  }

  async getSuppliers(): Promise<Supplier[]> {
    return this.supplierRepository.find();
  }

  async getSupplierById(id: number): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOne({ where: { id } });
    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }
    return supplier;
  }
  
  async updateSupplier(id: number, updateSupplierDto: UpdateSupplierDto): Promise<Supplier> {
    const { name, phone, email, address} = updateSupplierDto;
    const supplierExists = await this.supplierRepository.findOne({ where: { phone } });
    if (supplierExists) {
      throw new BadRequestException('Phone already exists');
    }
    const emailExists = await this.supplierRepository.findOne({ where: { email } });
    if (emailExists) {
      throw new BadRequestException('Email already exists');
    }
    const supplier = await this.getSupplierById(id);

    supplier.name = name || supplier.name;
    supplier.phone = phone || supplier.phone;
    supplier.email = email || supplier.email;
    supplier.address = address || supplier.address;

    return this.supplierRepository.save(supplier);
  }
  async delete(id:number){
    const supplierExists = await this.supplierRepository.findOne({where:{id}})
    if(!supplierExists){
      throw new NotFoundException('Supplier Not Found!')
    }
    await this.supplierRepository.delete(id)
    return {"success":"Supplier was Deleted Successfully!"}
  }
}