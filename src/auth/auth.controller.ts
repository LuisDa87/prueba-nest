// Controlador de auth: registro, login y refresh de tokens JWT.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Registrar usuario' })
  @Post('register')
  @Public()
  register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @ApiOperation({ summary: 'Iniciar sesión' })
  @Post('login')
  @Public()
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @ApiOperation({ summary: 'Renovar tokens con refresh' })
  @Post('refresh')
  @Public()
  refresh(@Body() data: RefreshTokenDto) {
    return this.authService.refresh(data.refreshToken);
  }
}
