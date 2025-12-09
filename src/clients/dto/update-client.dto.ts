// DTO de actualizacion de cliente: permite cambiar datos y usuario asociado.
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateClientDto {
  @ApiPropertyOptional({ example: 'Cliente Actualizado' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Empresa XYZ' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({ example: 'nuevo-contacto@empresa.com' })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiPropertyOptional({ description: 'Nuevo usuario con rol client' })
  @IsOptional()
  @IsUUID()
  userId?: string;
}
