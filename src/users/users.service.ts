// Servicio de usuarios: CRUD, hashing de passwords y manejo de refresh token.
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    const existing = await this.usersRepository.findOne({ where: { email: data.email } });
    if (existing) {
      throw new BadRequestException('Email ya registrado');
    }

    const password = await bcrypt.hash(data.password, 10);
    const user = this.usersRepository.create({
      ...data,
      role: data.role || UserRole.CLIENT,
      password,
    });
    return this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find({ order: { createdAt: 'DESC' } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (data.email && data.email !== user.email) {
      const exists = await this.usersRepository.findOne({ where: { email: data.email } });
      if (exists) throw new BadRequestException('Email ya registrado');
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    Object.assign(user, data);
    return this.usersRepository.save(user);
  }

  async setRefreshToken(userId: string, token: string | null) {
    await this.usersRepository.update({ id: userId }, { refreshToken: token });
  }

  async remove(id: string) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    await this.usersRepository.remove(user);
    return { id };
  }
}
