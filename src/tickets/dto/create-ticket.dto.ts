// DTO de creacion de ticket: valida titulo, descripcion, categoria, cliente y asignacion opcional.
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsUUID, MaxLength, MinLength } from 'class-validator';
import { TicketPriority } from '../ticket.entity';

export class CreateTicketDto {
  @ApiProperty({ example: 'No enciende el portátil' })
  @IsNotEmpty()
  @MaxLength(180)
  title: string;

  @ApiProperty({ example: 'El equipo no enciende después de la actualización.' })
  @IsNotEmpty()
  @MinLength(10)
  description: string;

  @ApiPropertyOptional({ enum: TicketPriority, example: TicketPriority.HIGH })
  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @ApiProperty({ description: 'Categoría del ticket' })
  @IsUUID()
  categoryId: string;

  @ApiProperty({ description: 'Cliente asociado' })
  @IsUUID()
  clientId: string;

  @ApiPropertyOptional({ description: 'Técnico asignado' })
  @IsOptional()
  @IsUUID()
  technicianId?: string;
}
