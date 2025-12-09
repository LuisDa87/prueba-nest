// DTO de creacion de tecnico: datos basicos y userId con rol technician.
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateTechnicianDto {
  @ApiProperty({ example: 'María Técnica' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Redes y servidores' })
  @IsNotEmpty()
  specialty: string;

  @ApiProperty({ description: 'ID de usuario con rol technician' })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  availability?: boolean;
}
