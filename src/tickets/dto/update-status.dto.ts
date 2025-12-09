// DTO para cambio de estado de ticket siguiendo la secuencia definida.
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TicketStatus } from '../ticket.entity';

export class UpdateStatusDto {
  @ApiProperty({ enum: TicketStatus, example: TicketStatus.IN_PROGRESS })
  @IsEnum(TicketStatus)
  status: TicketStatus;
}
