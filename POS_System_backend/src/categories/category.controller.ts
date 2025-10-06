import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Category } from "./entities/category.entity";
import { CategoryService } from "./category.services";
import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";


@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  createUser(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.createCategory(createCategoryDto);
  }
  @Get()
  getUsers(): Promise<Category[]> {
    return this.categoryService.getCategories();
  }
  @Get(':id')
  getUserById(@Param('id') id: number): Promise<Category> {
    return this.categoryService.getCategoryById(id);
  }
  @Patch(':id')
  updateUser(@Param('id') id: number, @Body() updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }
  @Delete(':id')
  deleteUser(@Param('id') id: number): Promise<{}> {
    return this.categoryService.delete(id);
  }
}