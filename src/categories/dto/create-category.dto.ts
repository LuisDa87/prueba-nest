// DTO de creacion de categoria de ticket.
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Incidente de Software' })
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Errores relacionados con aplicaciones' })
  @IsOptional()
  description?: string;
}
