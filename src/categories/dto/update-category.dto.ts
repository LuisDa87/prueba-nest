// DTO de actualizacion de categoria.
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'Incidente de Hardware' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'Problemas con dispositivos físicos' })
  @IsOptional()
  description?: string;
}
