// DTO de creacion de usuario con rol opcional.
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'Nuevo Usuario' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'nuevo@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'claveSegura123', minLength: 6 })
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ enum: UserRole, example: UserRole.CLIENT })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
