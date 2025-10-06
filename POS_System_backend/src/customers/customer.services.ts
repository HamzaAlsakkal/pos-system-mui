import { In, Repository } from "typeorm";
import { Customer } from "./entities/customer.entity";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { BadRequestException, NotFoundException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async createCustomer(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const { fullName, phone, email, } = createCustomerDto;
    const customerExists = await this.customerRepository.findOne({ where: { phone } });
    if (customerExists && phone) {
      throw new BadRequestException('Phone already exists');
    }
    const emailExists = await this.customerRepository.findOne({ where: { email } });
    if (emailExists && email) {
      throw new BadRequestException('Email already exists');
    }
    const customer = this.customerRepository.create({
        fullName,
        phone,
        email,
    });
    return this.customerRepository.save(customer);
  }

  async getCustomer(): Promise<Customer[]> {
    return this.customerRepository.find();
  }

  async getCustomerById(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }
  
  async updateCustomer(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const { fullName, phone, email } = updateCustomerDto;
    const customerExists = await this.customerRepository.findOne({ where: { phone } });
    if (customerExists && phone) {
      throw new BadRequestException('Phone already exists');
    }
    const emailExists = await this.customerRepository.findOne({ where: { email } });
    if (emailExists && email) {
      throw new BadRequestException('Email already exists');
    }
    const customer = await this.getCustomerById(id);
    customer.fullName = fullName ?? customer.fullName;
    customer.phone = phone ?? customer.phone;
    customer.email = email ?? customer.email;
    return this.customerRepository.save(customer);
  }
  async delete(id:number){
    const customerExists = await this.customerRepository.findOne({where:{id}})
    if(!customerExists){
      throw new NotFoundException('Customer Not Found!')
    }
    await this.customerRepository.delete(id)
    return {"success":"Customer was Deleted Successfully!"}
  }
}