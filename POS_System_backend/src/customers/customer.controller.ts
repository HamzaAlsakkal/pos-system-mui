import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { Customer } from "./entities/customer.entity";
import { CustomerService } from "./customer.services";
import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";


@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  createUser(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.customerService.createCustomer(createCustomerDto);
  }
  @Get()
  getUsers(): Promise<Customer[]> {
    return this.customerService.getCustomer();
  }
  @Get(':id')
  getUserById(@Param('id') id: number): Promise<Customer> {
    return this.customerService.getCustomerById(id);
  }
  @Patch(':id')
  updateUser(@Param('id') id: number, @Body() updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    return this.customerService.updateCustomer(id, updateCustomerDto);
  }
  @Delete(':id')
  deleteUser(@Param('id') id: number): Promise<{}> {
    return this.customerService.delete(id);
  }
}