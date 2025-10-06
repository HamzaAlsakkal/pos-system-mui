import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User, UserRole } from "./entities/user.entity";
import { UserService } from "./user.services";
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new user',
    description: 'Create a new user in the system'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully created',
    type: User
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data' 
  })
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Get all users',
    description: 'Retrieve all users (Admin only)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Users retrieved successfully',
    type: [User]
  })
  @ApiUnauthorizedResponse({ 
    description: 'Unauthorized - Invalid or missing token' 
  })
  @ApiForbiddenResponse({ 
    description: 'Forbidden - Admin role required' 
  })
  getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Get user by ID',
    description: 'Retrieve a specific user by ID (Admin only)'
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User retrieved successfully',
    type: User
  })
  @ApiNotFoundResponse({ 
    description: 'User not found' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Unauthorized - Invalid or missing token' 
  })
  @ApiForbiddenResponse({ 
    description: 'Forbidden - Admin role required' 
  })
  getUserById(@Param('id') id: number): Promise<User> {
    return this.userService.getUserById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Update user',
    description: 'Update a specific user by ID (Admin only)'
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User updated successfully',
    type: User
  })
  @ApiNotFoundResponse({ 
    description: 'User not found' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Unauthorized - Invalid or missing token' 
  })
  @ApiForbiddenResponse({ 
    description: 'Forbidden - Admin role required' 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data' 
  })
  updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Delete user',
    description: 'Delete a specific user by ID (Admin only)'
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User deleted successfully',
    schema: {
      example: { message: 'User deleted successfully' }
    }
  })
  @ApiNotFoundResponse({ 
    description: 'User not found' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Unauthorized - Invalid or missing token' 
  })
  @ApiForbiddenResponse({ 
    description: 'Forbidden - Admin role required' 
  })
  deleteUser(@Param('id') id: number): Promise<{}> {
    return this.userService.delete(id);
  }
}