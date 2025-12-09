// Seed inicial: crea admin, tecnico, cliente, categorias y un ticket demo.
import * as bcrypt from 'bcryptjs';
import AppDataSource from './typeorm-data-source';
import { User, UserRole } from '../users/user.entity';
import { Category } from '../categories/category.entity';
import { Technician } from '../technicians/technician.entity';
import { Client } from '../clients/client.entity';
import { Ticket, TicketPriority, TicketStatus } from '../tickets/ticket.entity';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Conectado a la base de datos');

    const userRepo = AppDataSource.getRepository(User);
    const categoryRepo = AppDataSource.getRepository(Category);
    const technicianRepo = AppDataSource.getRepository(Technician);
    const clientRepo = AppDataSource.getRepository(Client);
    const ticketRepo = AppDataSource.getRepository(Ticket);

    const [admin, technicianUser, clientUser] = await Promise.all([
      upsertUser(userRepo, {
        name: 'Admin',
        email: 'admin@techhelpdesk.com',
        password: 'admin123',
        role: UserRole.ADMIN,
      }),
      upsertUser(userRepo, {
        name: 'Técnico Ana',
        email: 'tech@techhelpdesk.com',
        password: 'tech123',
        role: UserRole.TECHNICIAN,
      }),
      upsertUser(userRepo, {
        name: 'Cliente Carlos',
        email: 'client@techhelpdesk.com',
        password: 'client123',
        role: UserRole.CLIENT,
      }),
    ]);

    const clientProfile = await upsertClient(clientRepo, clientUser);
    const technicianProfile = await upsertTechnician(technicianRepo, technicianUser);

    const categories = [
      { name: 'Solicitud', description: 'Requerimientos de servicio' },
      { name: 'Incidente de Hardware', description: 'Problemas de equipos físicos' },
      { name: 'Incidente de Software', description: 'Aplicaciones y sistemas' },
    ];
    for (const cat of categories) {
      const exists = await categoryRepo.findOne({ where: { name: cat.name } });
      if (!exists) {
        await categoryRepo.save(categoryRepo.create(cat));
      }
    }

    const category = await categoryRepo.findOne({ where: { name: 'Incidente de Software' } });
    if (category) {
      const existingTicket = await ticketRepo.findOne({
        where: { title: 'Error al iniciar sesión en CRM' },
      });
      if (!existingTicket) {
        await ticketRepo.save(
          ticketRepo.create({
            title: 'Error al iniciar sesión en CRM',
            description: 'El usuario no puede iniciar sesión en el CRM después de la actualización.',
            status: TicketStatus.IN_PROGRESS,
            priority: TicketPriority.HIGH,
            category,
            client: clientProfile,
            technician: technicianProfile,
          }),
        );
      }
    }

    console.log('Seed completado');
  } catch (error) {
    console.error('Error en seed:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

async function upsertUser(
  repo: import('typeorm').Repository<User>,
  data: { name: string; email: string; password: string; role: UserRole },
) {
  const existing = await repo.findOne({ where: { email: data.email } });
  if (existing) return existing;
  const password = await bcrypt.hash(data.password, 10);
  return repo.save(
    repo.create({
      name: data.name,
      email: data.email,
      password,
      role: data.role,
    }),
  );
}

async function upsertClient(repo: import('typeorm').Repository<Client>, user: User) {
  const existing = await repo.findOne({ where: { contactEmail: user.email } });
  if (existing) return existing;
  return repo.save(
    repo.create({
      name: user.name,
      company: 'Empresa Demo',
      contactEmail: user.email,
      user,
    }),
  );
}

async function upsertTechnician(repo: import('typeorm').Repository<Technician>, user: User) {
  const existing = await repo.findOne({ where: { user: { id: user.id } } });
  if (existing) return existing;
  return repo.save(
    repo.create({
      name: user.name,
      specialty: 'Soporte general',
      availability: true,
      user,
    }),
  );
}

seed();
