// Servicio de tecnicos: CRUD y control de vinculo con usuarios rol technician.
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Technician } from './technician.entity';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
import { User, UserRole } from '../users/user.entity';

@Injectable()
export class TechniciansService {
  constructor(
    @InjectRepository(Technician)
    private readonly techniciansRepository: Repository<Technician>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(data: CreateTechnicianDto) {
    const user = await this.usersRepository.findOne({ where: { id: data.userId } });
    if (!user) throw new BadRequestException('Usuario no encontrado');
    if (user.role !== UserRole.TECHNICIAN) {
      throw new BadRequestException('El usuario debe tener rol technician');
    }

    const existing = await this.techniciansRepository.findOne({ where: { user: { id: data.userId } } });
    if (existing) throw new BadRequestException('Técnico ya existe para este usuario');

    // Capa de dominio: perfil técnico queda ligado a user con rol technician
    const technician = this.techniciansRepository.create({
      name: data.name,
      specialty: data.specialty,
      availability: data.availability ?? true,
      user,
    });
    return this.techniciansRepository.save(technician);
  }

  findAll() {
    return this.techniciansRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }

  async findById(id: string) {
    const technician = await this.techniciansRepository.findOne({
      where: { id },
      relations: ['user', 'tickets'],
    });
    if (!technician) throw new NotFoundException('Técnico no encontrado');
    return technician;
  }

  async update(id: string, data: UpdateTechnicianDto) {
    const technician = await this.findById(id);

    if (data.userId && data.userId !== technician.user.id) {
      const user = await this.usersRepository.findOne({ where: { id: data.userId } });
      if (!user) throw new BadRequestException('Usuario no encontrado');
      if (user.role !== UserRole.TECHNICIAN) {
        throw new BadRequestException('El usuario debe tener rol technician');
      }
      technician.user = user;
    }

    Object.assign(technician, {
      name: data.name ?? technician.name,
      specialty: data.specialty ?? technician.specialty,
      availability: data.availability ?? technician.availability,
    });

    return this.techniciansRepository.save(technician);
  }

  async remove(id: string) {
    const technician = await this.findById(id);
    await this.techniciansRepository.remove(technician);
    return { id };
  }
}
