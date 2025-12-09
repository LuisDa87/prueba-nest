// Entidad Client: representa el cliente asociado a un usuario con rol client.
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Ticket } from '../tickets/ticket.entity';
import { User } from '../users/user.entity';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 120 })
  name: string;

  @Column({ length: 150 })
  company: string;

  @Column({ name: 'contact_email', length: 150, unique: true })
  contactEmail: string;

  @OneToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Ticket, (ticket) => ticket.client)
  tickets: Ticket[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
