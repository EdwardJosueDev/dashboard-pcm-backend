// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service'; // Usa tu service con repository
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/auth.dto';
import { UserRepository } from '../users/repositories/user.repository';
import { CryptHelper } from '../common/helpers/crypt.helper';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';

export class AuthUserDTO {
  id: number;
  email: string;
  roleId: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        entityId: user.entityId,
      },
    };
  }
  

  async login(user: User, rememberMe: boolean) {
    const payload = { email: user.email, sub: user.id };
    
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: rememberMe ? '30d' : '1d',
      }),
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const result = await this.userRepository.findOneByEmail(email);
    if (!result) {
      throw new NotFoundException(
        'Parece que no hay ninguna cuenta asociada a este correo electrónico.',
      );
    }
    const user = result.toJSON();
    const isValidPassword = await CryptHelper.compare(password, user?.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Contraseña incorrecta.');
    }

    return this.userRepository.findById(user.id, {
      include: [
        {
          model: Role,
        },
      ],
    });
  }

  async findById(id: number): Promise<AuthUserDTO> {
    const user = await this.userRepository.findById(id, {
      include: [
        {
          model: Role,
        },
      ],
    });
    if (!user) throw new UnauthorizedException('No se encontro el usuario');

    return user;
  }
}