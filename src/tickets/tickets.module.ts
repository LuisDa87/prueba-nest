// Modulo de tickets: ensambla repositorio, servicios dependientes y controlador.
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from '../categories/categories.module';
import { ClientsModule } from '../clients/clients.module';
import { TechniciansModule } from '../technicians/technicians.module';
import { Ticket } from './ticket.entity';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket]),
    CategoriesModule,
    ClientsModule,
    TechniciansModule,
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}
