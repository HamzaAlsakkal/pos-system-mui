import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/users/entities/user.entity';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  fullName: string;

  @ApiProperty({
    example: 'johndoe',
    description: 'Unique username',
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  username: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password (minimum 6 characters)',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
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
  role?: UserRole = UserRole.CASHIER;
}