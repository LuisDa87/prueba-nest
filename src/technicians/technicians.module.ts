// Modulo de tecnicos: expone repositorios y servicio/controlador del dominio.
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Technician } from './technician.entity';
import { TechniciansController } from './technicians.controller';
import { TechniciansService } from './technicians.service';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Technician, User])],
  controllers: [TechniciansController],
  providers: [TechniciansService],
  exports: [TechniciansService],
})
export class TechniciansModule {}
