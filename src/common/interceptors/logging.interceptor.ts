// Interceptor de logging: traza duracion y ruta de cada request.
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;
    const started = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - started;
        // Log simple audit line; could be replaced with a logger service
        console.log(`[${method}] ${url} - ${duration}ms`);
      }),
    );
  }
}
