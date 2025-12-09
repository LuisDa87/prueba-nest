// Controlador raiz: expone health check publico de la API TechHelpDesk.
import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  @Get()
  @Public()
  health() {
    return { ok: true, name: 'TechHelpDesk API (NestJS)' };
  }
}
