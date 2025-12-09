// DTO de refresh: recibe refreshToken para renovar accesos.
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token vigente' })
  @IsNotEmpty()
  refreshToken: string;
}
