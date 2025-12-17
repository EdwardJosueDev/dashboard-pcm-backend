// src/auth/auth.controller.ts
import { Controller, Post, Body, UsePipes, ValidationPipe, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { Public } from './public.decorator'; 
import { AuthGuard } from '@nestjs/passport';
import { LoginDTO } from './dto/login.dto';
import { JwtAuthGuard } from '@modules/common/guards/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '@modules/users/entities/user.entity';
import { CurrentUser } from '@modules/common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    return user;
  }

  @UseGuards(AuthGuard('local'))
  @Public()
  @Post('login')
  async login(
    @Request() req,
    @Body() dto: LoginDTO,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(req.user.toJSON(), dto.rememberMe);
  }
}