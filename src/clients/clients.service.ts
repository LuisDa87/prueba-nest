// Servicio de clientes: CRUD y vinculo 1:1 con usuarios rol client.
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { Client } from './client.entity';
import { User, UserRole } from '../users/user.entity';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(data: CreateClientDto) {
    const existing = await this.clientsRepository.findOne({
      where: { contactEmail: data.contactEmail },
    });
    if (existing) throw new BadRequestException('Cliente ya existe');

    if (!data.userId) {
      throw new BadRequestException('Se requiere userId con rol client');
    }

    const user = await this.usersRepository.findOne({ where: { id: data.userId } });
    if (!user) throw new BadRequestException('Usuario no encontrado');
    if (user.role !== UserRole.CLIENT) throw new BadRequestException('El usuario debe ser cliente');

    const clientForUser = await this.clientsRepository.findOne({ where: { user: { id: data.userId } } });
    if (clientForUser) throw new BadRequestException('Ese usuario ya tiene un perfil de cliente');

    // Amarramos perfil client al user con rol client
    const client = this.clientsRepository.create({
      name: data.name,
      company: data.company,
      contactEmail: data.contactEmail,
      user,
    });
    return this.clientsRepository.save(client);
  }

  findAll() {
    return this.clientsRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }

  async findById(id: string) {
    const client = await this.clientsRepository.findOne({
      where: { id },
      relations: ['user', 'tickets'],
    });
    if (!client) throw new NotFoundException('Cliente no encontrado');
    return client;
  }

  async update(id: string, data: UpdateClientDto) {
    const client = await this.findById(id);

    if (data.contactEmail && data.contactEmail !== client.contactEmail) {
      const exists = await this.clientsRepository.findOne({
        where: { contactEmail: data.contactEmail },
      });
      if (exists) throw new BadRequestException('Email de contacto ya usado');
    }

    if (data.userId && data.userId !== client.user.id) {
      const user = await this.usersRepository.findOne({ where: { id: data.userId } });
      if (!user) throw new BadRequestException('Usuario no encontrado');
      if (user.role !== UserRole.CLIENT) throw new BadRequestException('El usuario debe ser cliente');
      const otherClient = await this.clientsRepository.findOne({
        where: { user: { id: data.userId } },
      });
      if (otherClient && otherClient.id !== client.id) {
        throw new BadRequestException('Ese usuario ya tiene un perfil de cliente');
      }
      client.user = user;
    }

    Object.assign(client, {
      name: data.name ?? client.name,
      company: data.company ?? client.company,
      contactEmail: data.contactEmail ?? client.contactEmail,
    });
    return this.clientsRepository.save(client);
  }

  async remove(id: string) {
    const client = await this.findById(id);
    await this.clientsRepository.remove(client);
    return { id };
  }
}
