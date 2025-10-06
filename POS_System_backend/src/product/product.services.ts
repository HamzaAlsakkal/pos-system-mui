import { Injectable, ConflictException, NotFoundException} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Products } from "./entities/product.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { CategoryService } from "src/categories/category.services";


@Injectable()
export class ProductService{
    constructor(
        @InjectRepository(Products)
        private readonly productRepository: Repository<Products>,
        private readonly categoryService: CategoryService
    ){}
    async create(createProductDto: CreateProductDto): Promise<Products> {
      const { name, price, categoryId, barcode, stock } = createProductDto;
      const category = await this.categoryService.getCategoryById(categoryId);
      if(!category){
        throw new NotFoundException("Category not found!")
      }
      const existingProduct = await this.productRepository.findOne({ where: { name } });
      if (existingProduct) {
        throw new ConflictException('Product with this name already exists');
      }
      const product = this.productRepository.create({
        name,
        price,
        categoryId,
        barcode,
        stock,
      });
      return this.productRepository.save(product);
    }
    async getAll():Promise<Products[]>{
      return await this.productRepository.find()
    }

    async getById(id:number):Promise<Products>{
      const product = await this.productRepository.findOne({ where: { id } });
      if(!product){
        throw new NotFoundException("Product not found!")
      }      
      return product
    }

    async update(id:number, updateProductDto: UpdateProductDto): Promise<Products> {
      const { name, barcode, price,categoryId,stock } = updateProductDto;
      const product = await this.productRepository.findOne({ where: { id } });
      if(!product){
        throw new NotFoundException("Product not found!")
      }
      if(categoryId){
        const category = await this.categoryService.getCategoryById(categoryId);
        if(!category){
          throw new NotFoundException("Category not found!")
        }
        product.categoryId = categoryId 
      }
      if(name){
        const existingProduct = await this.productRepository.findOne({ where: { name } });
        if (existingProduct) {
          throw new ConflictException('Product with this name already exists');
        }
      }
      stock === 0 ? product.stock = 0 : (product.stock = stock || product.stock)
      product.name = name || product.name
      product.barcode = barcode || product.barcode
      product.price = price || product.price
      return this.productRepository.save(product);
    }

    async delate(id:number):Promise<{}>{
      const product = await this.productRepository.findOne({ where: { id } });
      if(!product){
        throw new NotFoundException("Product not found!")
      }
      await this.productRepository.delete(id)
      return {'message':'Deleted Product was Successfully!'}
    }
}


