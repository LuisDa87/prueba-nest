// Modulo de clientes: expone repositorios de Client y User y su servicio/controlador.
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsController } from './clients.controller';
import { Client } from './client.entity';
import { ClientsService } from './clients.service';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, User])],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
