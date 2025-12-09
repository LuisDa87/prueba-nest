// Bootstrap de NestJS con pipes, CORS y swagger configurado para TechHelpDesk.
import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const configService = app.get(ConfigService);
  const swaggerConfig = new DocumentBuilder()
    .setTitle('TechHelpDesk API')
    .setDescription('API de soporte técnico TechHelpDesk (NestJS)')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = configService.get<number>('port') ?? 3000;
  await app.listen(port);
  console.log(`API NestJS escuchando en puerto ${port}`);
}

bootstrap();
