// Entidad Ticket: modela titulo, descripcion, estado, prioridad y relaciones.
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../categories/category.entity';
import { Client } from '../clients/client.entity';
import { Technician } from '../technicians/technician.entity';

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 180 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.OPEN })
  status: TicketStatus;

  @Column({ type: 'enum', enum: TicketPriority, default: TicketPriority.MEDIUM })
  priority: TicketPriority;

  @ManyToOne(() => Category, (category) => category.tickets, { eager: true, onDelete: 'RESTRICT' })
  category: Category;

  @ManyToOne(() => Client, (client) => client.tickets, { eager: true, onDelete: 'CASCADE' })
  client: Client;

  @ManyToOne(() => Technician, (technician) => technician.tickets, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  technician?: Technician | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
