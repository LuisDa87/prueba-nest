// Entidad Technician: representa tecnicos y su relacion con usuario y tickets.
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Ticket } from '../tickets/ticket.entity';
import { User } from '../users/user.entity';

@Entity('technicians')
export class Technician {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 120 })
  name: string;

  @Column({ length: 150 })
  specialty: string;

  @Column({ default: true })
  availability: boolean;

  @OneToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Ticket, (ticket) => ticket.technician)
  tickets: Ticket[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
