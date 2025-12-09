// DTO de creacion de cliente: vincula datos basicos con un usuario rol client.
import { IsEmail, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({ example: 'Cliente Demo' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Acme Corp' })
  @IsNotEmpty()
  company: string;

  @ApiProperty({ example: 'cliente@empresa.com' })
  @IsEmail()
  contactEmail: string;

  @ApiPropertyOptional({ description: 'ID de usuario con rol client' })
  @IsOptional()
  @IsUUID()
  userId?: string;
}
