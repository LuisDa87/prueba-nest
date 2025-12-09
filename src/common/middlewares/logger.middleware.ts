// Middleware de logger: marca el inicio de la request para medir tiempos.
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    req['requestStart'] = Date.now();
    next();
  }
}
