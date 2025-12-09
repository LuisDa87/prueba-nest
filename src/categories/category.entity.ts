// Entidad Category: agrupa tickets por tipo de incidente o solicitud.
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Ticket } from '../tickets/ticket.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 120, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @OneToMany(() => Ticket, (ticket) => ticket.category)
  tickets: Ticket[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
