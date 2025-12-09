// Servicio de auth: maneja registro/login, emision de tokens y refresh.
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { ClientsService } from '../clients/clients.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly clientsService: ClientsService,
  ) {}

  async register(data: RegisterDto) {
    const user = await this.usersService.create(data);
    if (user.role === UserRole.CLIENT) {
      await this.clientsService.create({
        name: user.name,
        company: data.company || 'N/A',
        contactEmail: user.email,
        userId: user.id,
      });
    }
    return this.buildAuthResponse(user);
  }

  async login(data: LoginDto) {
    const user = await this.usersService.findByEmail(data.email);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const ok = await bcrypt.compare(data.password, user.password);
    if (!ok) throw new UnauthorizedException('Credenciales inválidas');

    return this.buildAuthResponse(user);
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });

      const user = await this.usersService.findById(payload.sub);
      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Refresh inválido');
      }

      const tokens = this.buildTokens(user);
      await this.usersService.setRefreshToken(user.id, tokens.refreshToken);
      return { user: this.sanitize(user), ...tokens };
    } catch {
      throw new UnauthorizedException('Refresh inválido');
    }
  }

  private buildTokens(user: User) {
    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.expiresIn'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
    });
    return { accessToken, refreshToken };
  }

  private async buildAuthResponse(user: User) {
    const tokens = this.buildTokens(user);
    await this.usersService.setRefreshToken(user.id, tokens.refreshToken);
    return {
      user: this.sanitize(user),
      ...tokens,
    };
  }

  private sanitize(user: User) {
    const { password, refreshToken, ...rest } = user;
    return rest;
  }
}
