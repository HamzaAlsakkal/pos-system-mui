import { Repository } from "typeorm";
import { Category } from "./entities/category.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { name, description } = createCategoryDto;
    const categoryExists = await this.categoryRepository.findOne({ where: { name } });
    if (categoryExists) {
      throw new BadRequestException('Name already exists');
    }
    const user = this.categoryRepository.create({
        name,
        description,
    });
    return this.categoryRepository.save(user);
  }

  async getCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async getCategoryById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }
  
  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const { name, description } = updateCategoryDto;
    const categoryExists = await this.categoryRepository.findOne({ where: { name } });
    if (categoryExists) {
      throw new BadRequestException('Name already exists');
    }
    const category = await this.getCategoryById(id);
    category.name = name ?? category.name;
    category.description = description ?? category.description;
    return this.categoryRepository.save(category);
  }
  async delete(id:number){
    const userExists = await this.categoryRepository.findOne({where:{id}})
    if(!userExists){
      throw new NotFoundException('Category Not Found!')
    }
    await this.categoryRepository.delete(id)
    return {"success":"User was Deleted Successfully!"}
  }
}