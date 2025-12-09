// DTO de actualizacion de usuario: permite cambiar datos y rol.
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../user.entity';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Nombre Actualizado' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'actualizado@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'nuevaClave123', minLength: 6 })
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({ enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
