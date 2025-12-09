// DTO de registro: datos basicos y rol opcional para crear usuario.
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../users/user.entity';

export class RegisterDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'juan@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'Empresa Cliente' })
  @IsOptional()
  company?: string;

  @ApiProperty({ example: 'claveSegura123', minLength: 6 })
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ enum: UserRole, example: UserRole.CLIENT })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
