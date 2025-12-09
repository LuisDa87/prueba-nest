// Guard de api-key (legado): valida header x-api-key si el endpoint lo marca.
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { IS_API_KEY } from '../decorators/api-key.decorator';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const isProtected = this.reflector.getAllAndOverride<boolean>(IS_API_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!isProtected) return true;

    const req = context.switchToHttp().getRequest();
    const apiKeyHeader = req.headers['x-api-key'] as string | undefined;
    const expected = this.config.get<string>('apiKeyDefault');
    if (!expected) throw new UnauthorizedException('API key no configurada');

    if (!apiKeyHeader || apiKeyHeader !== expected) {
      throw new UnauthorizedException('API key inválida');
    }
    return true;
  }
}
