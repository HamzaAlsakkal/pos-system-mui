import { IsEnum, IsNotEmpty, IsOptional, IsString, IsEmail } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from "../entities/user.entity";

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    example: 'johndoe',
    description: 'Unique username',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: UserRole.CASHIER,
    description: 'User role in the system',
    enum: UserRole,
    default: UserRole.CASHIER,
    required: false,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role: UserRole;
}