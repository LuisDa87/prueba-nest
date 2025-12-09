// DTO para actualizar prioridad, categoria o tecnico de un ticket.
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { TicketPriority } from '../ticket.entity';

export class UpdateTicketDto {
  @ApiPropertyOptional({ enum: TicketPriority })
  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @ApiPropertyOptional({ description: 'Nuevo técnico' })
  @IsOptional()
  @IsUUID()
  technicianId?: string;

  @ApiPropertyOptional({ description: 'Nueva categoría' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
