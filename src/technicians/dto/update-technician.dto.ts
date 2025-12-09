// DTO de actualizacion de tecnico: permite cambiar datos y usuario vinculado.
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateTechnicianDto {
  @ApiPropertyOptional({ example: 'Nombre actualizado' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Soporte de aplicaciones' })
  @IsOptional()
  @IsString()
  specialty?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  availability?: boolean;

  @ApiPropertyOptional({ description: 'Nuevo userId con rol technician' })
  @IsOptional()
  @IsUUID()
  userId?: string;
}
