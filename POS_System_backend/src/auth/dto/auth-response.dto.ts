import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/users/entities/user.entity';

export class UserResponseDto {
  @ApiProperty({
    example: 1,
    description: 'User ID',
  })
  id: number;

  @ApiProperty({
    example: 'admin@pos.com',
    description: 'User email address',
  })
  email: string;

  @ApiProperty({
    example: 'Admin User',
    description: 'Full name of the user',
  })
  fullName: string;

  @ApiProperty({
    example: 'admin',
    description: 'Username',
  })
  username: string;

  @ApiProperty({
    example: UserRole.ADMIN,
    description: 'User role',
    enum: UserRole,
  })
  role: UserRole;
}

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  access_token: string;

  @ApiProperty({
    type: () => Object,
    description: 'User information without password',
    example: {
      id: 1,
      email: 'admin@pos.com',
      fullName: 'Admin User',
      username: 'admin',
      role: 'admin'
    }
  })
  user: Partial<UserResponseDto>;
}

export class MessageResponseDto {
  @ApiProperty({
    example: 'Password changed successfully',
    description: 'Response message',
  })
  message: string;
}