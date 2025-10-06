import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthResponseDto, UserResponseDto, MessageResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.services';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ 
    summary: 'Register a new user',
    description: 'Create a new user account in the system'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully registered',
    type: AuthResponseDto
  })
  @ApiConflictResponse({ 
    description: 'User with this email already exists' 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data' 
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'User login',
    description: 'Authenticate user and return JWT token'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User successfully logged in',
    type: AuthResponseDto
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid email or password' 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data' 
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Get current user',
    description: 'Get current authenticated user information'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User information retrieved successfully',
    type: UserResponseDto
  })
  @ApiUnauthorizedResponse({ 
    description: 'Unauthorized - Invalid or missing token' 
  })
  async getMe(@CurrentUser() user: User) {
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Change user password',
    description: 'Change the password for the authenticated user'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Password changed successfully',
    type: MessageResponseDto
  })
  @ApiUnauthorizedResponse({ 
    description: 'Unauthorized - Invalid or missing token' 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid current password or input data' 
  })
  async changePassword(
    @CurrentUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user.id, changePasswordDto);
  }
}