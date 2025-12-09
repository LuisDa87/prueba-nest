// Servicio de tickets: maneja creacion, asignacion y reglas de estado/capacidad.
import { BadRequestException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesService } from '../categories/categories.service';
import { ClientsService } from '../clients/clients.service';
import { TechniciansService } from '../technicians/technicians.service';
import { UserRole } from '../users/user.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket, TicketStatus } from './ticket.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketsRepository: Repository<Ticket>,
    private readonly categoriesService: CategoriesService,
    private readonly clientsService: ClientsService,
    private readonly techniciansService: TechniciansService,
  ) {}

  async create(data: CreateTicketDto, currentUser?: { sub: string; role: UserRole }) {
    const category = await this.categoriesService.findById(data.categoryId);
    const client = await this.clientsService.findById(data.clientId);

    // Cliente no puede crear tickets para otro cliente
    if (currentUser?.role === UserRole.CLIENT && client.user.id !== currentUser.sub) {
      throw new ForbiddenException('No puedes crear tickets para otro cliente');
    }

    let technician = null;
    if (data.technicianId) {
      technician = await this.techniciansService.findById(data.technicianId);
    }

    const ticket = this.ticketsRepository.create({
      title: data.title,
      description: data.description,
      priority: data.priority,
      category,
      client,
      technician: technician ?? null,
    });
    return this.ticketsRepository.save(ticket);
  }

  findAll() {
    return this.ticketsRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: string) {
    const ticket = await this.ticketsRepository.findOne({ where: { id } });
    if (!ticket) throw new NotFoundException('Ticket no encontrado');
    return ticket;
  }

  async findByClient(clientId: string, currentUser?: { sub: string; role: UserRole }) {
    const client = await this.clientsService.findById(clientId);
    if (currentUser?.role === UserRole.CLIENT && client.user.id !== currentUser.sub) {
      throw new ForbiddenException('No puedes ver tickets de otro cliente');
    }
    return this.ticketsRepository.find({
      where: { client: { id: clientId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findByTechnician(
    technicianId: string,
    currentUser?: { sub: string; role: UserRole },
  ) {
    const technician = await this.techniciansService.findById(technicianId);
    if (currentUser?.role === UserRole.TECHNICIAN && technician.user.id !== currentUser.sub) {
      throw new ForbiddenException('No puedes ver tickets de otro técnico');
    }
    return this.ticketsRepository.find({
      where: { technician: { id: technicianId } },
      order: { createdAt: 'DESC' },
    });
  }

  async updateTicket(id: string, data: UpdateTicketDto) {
    const ticket = await this.findById(id);

    if (data.categoryId) {
      ticket.category = await this.categoriesService.findById(data.categoryId);
    }

    if (data.technicianId) {
      const technician = await this.techniciansService.findById(data.technicianId);
      if (ticket.status === TicketStatus.IN_PROGRESS) {
        await this.assertTechnicianCapacity(technician.id, ticket.id);
      }
      ticket.technician = technician;
    }

    if (data.priority) {
      ticket.priority = data.priority;
    }

    return this.ticketsRepository.save(ticket);
  }

  async updateStatus(id: string, dto: UpdateStatusDto) {
    const ticket = await this.findById(id);
    // Validamos secuencia de estados según enunciado
    this.ensureValidTransition(ticket.status, dto.status);

    if (dto.status === TicketStatus.IN_PROGRESS) {
      if (!ticket.technician) {
        throw new BadRequestException('El ticket debe tener un técnico asignado');
      }
      // Limite de 5 tickets en progreso por técnico
      await this.assertTechnicianCapacity(ticket.technician.id, ticket.id);
    }

    ticket.status = dto.status;
    return this.ticketsRepository.save(ticket);
  }

  private ensureValidTransition(current: TicketStatus, next: TicketStatus) {
    const allowed: Record<TicketStatus, TicketStatus[]> = {
      [TicketStatus.OPEN]: [TicketStatus.IN_PROGRESS],
      [TicketStatus.IN_PROGRESS]: [TicketStatus.RESOLVED],
      [TicketStatus.RESOLVED]: [TicketStatus.CLOSED],
      [TicketStatus.CLOSED]: [],
    };

    const validNext = allowed[current] || [];
    if (!validNext.includes(next)) {
      throw new BadRequestException(
        `Transición inválida: ${current} → ${next}. Secuencia permitida: Abierto → En progreso → Resuelto → Cerrado`,
      );
    }
  }

  private async assertTechnicianCapacity(technicianId: string, excludeTicketId?: string) {
    const qb = this.ticketsRepository
      .createQueryBuilder('ticket')
      .where('ticket.technicianId = :technicianId', { technicianId })
      .andWhere('ticket.status = :status', { status: TicketStatus.IN_PROGRESS });

    if (excludeTicketId) {
      qb.andWhere('ticket.id <> :ticketId', { ticketId: excludeTicketId });
    }

    const count = await qb.getCount();
    if (count >= 5) {
      // No dejar pasar más de 5 tickets en progreso para un técnico
      throw new BadRequestException('El técnico ya tiene 5 tickets en progreso');
    }
  }
}
