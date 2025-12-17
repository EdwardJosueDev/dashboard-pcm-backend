// src/users/users.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { col, fn, where } from 'sequelize';
import { Entity } from '../entities/entities/entity.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '@modules/roles/entities/role.entity';
import { PaginatedResponse } from '@modules/common/interfaces/paginated-response.interface';



@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findOneByEmail(
      createUserDto.email,
    );
    if (existing) {
      throw new BadRequestException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    return this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async findAll(): Promise<PaginatedResponse<User>> {
    return await this.userRepository.findAndCountAll({
      include: [
        {
          model: Entity,
          required: true
        },
        {
          model: Role,
          required: true
        }
      ], 
    });
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findById(id, {
      include: [
        {
          model: Entity,
          required: true
        }
      ], 
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneByEmail(email);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {

    const user = (await this.userRepository.findById(id)).toJSON();

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    if (updateUserDto.email) {
      const normalizedNewEmail = updateUserDto.email.toLowerCase();
      const normalizedCurrentEmail = user.email.toLowerCase();

      if (normalizedNewEmail !== normalizedCurrentEmail) {
        const existing = await this.userRepository.findOneByEmail(normalizedNewEmail);
        if (existing && existing.id !== id) {
          throw new BadRequestException('El email ya está en uso por otro usuario');
        }
      }

      updateUserDto.email = normalizedNewEmail;
    }

    if (updateUserDto.password && updateUserDto.password.trim() !== '') {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 12);
    } else {
      delete updateUserDto.password;
    }

    await this.userRepository.update(id, updateUserDto);

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}