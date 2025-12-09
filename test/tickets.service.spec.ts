import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriesService } from '../src/categories/categories.service';
import { ClientsService } from '../src/clients/clients.service';
import { TechniciansService } from '../src/technicians/technicians.service';
import { Ticket, TicketPriority, TicketStatus } from '../src/tickets/ticket.entity';
import { UserRole } from '../src/users/user.entity';
import { TicketsService } from '../src/tickets/tickets.service';

const createRepositoryMock = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  createQueryBuilder: jest.fn(),
});

describe('TicketsService', () => {
  let service: TicketsService;
  let ticketRepo: ReturnType<typeof createRepositoryMock>;

  const category = { id: 'cat-1', name: 'Software' } as any;
  const client = { id: 'client-1', user: { id: 'user-client' } } as any;

  beforeEach(async () => {
    ticketRepo = createRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        { provide: CategoriesService, useValue: { findById: jest.fn().mockResolvedValue(category) } },
        { provide: ClientsService, useValue: { findById: jest.fn().mockResolvedValue(client) } },
        { provide: TechniciansService, useValue: { findById: jest.fn() } },
        { provide: getRepositoryToken(Ticket), useValue: ticketRepo },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
  });

  it('crea un ticket con datos válidos', async () => {
    const dto = {
      title: 'Falla en CRM',
      description: 'No carga el panel principal',
      priority: TicketPriority.HIGH,
      categoryId: 'cat-1',
      clientId: 'client-1',
    };

    const created = { ...dto, id: 'ticket-1' } as any;

    ticketRepo.create.mockReturnValue(created);
    ticketRepo.save.mockResolvedValue(created);

    const result = await service.create(dto, { sub: 'user-client', role: UserRole.CLIENT });

    expect(ticketRepo.create).toHaveBeenCalled();
    expect(ticketRepo.save).toHaveBeenCalledWith(created);
    expect(result.id).toBe('ticket-1');
  });

  it('actualiza el estado respetando la secuencia', async () => {
    const ticket = {
      id: 'ticket-1',
      status: TicketStatus.OPEN,
      technician: { id: 'tech-1' },
    } as any;

    ticketRepo.findOne.mockResolvedValue(ticket);

    const qb: any = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getCount: jest.fn().mockResolvedValue(0),
    };
    ticketRepo.createQueryBuilder.mockReturnValue(qb);
    ticketRepo.save.mockImplementation(async (t) => t);

    const result = await service.updateStatus('ticket-1', { status: TicketStatus.IN_PROGRESS });

    expect(ticketRepo.createQueryBuilder).toHaveBeenCalled();
    expect(result.status).toBe(TicketStatus.IN_PROGRESS);
  });
});
