// Controlador de tickets: expone endpoints protegidos para crear, listar y actualizar estado.
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@ApiTags('tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @ApiOperation({ summary: 'Crear ticket' })
  @Roles(UserRole.ADMIN, UserRole.CLIENT)
  @Post()
  create(@Body() data: CreateTicketDto, @CurrentUser() user: any) {
    return this.ticketsService.create(data, user);
  }

  @ApiOperation({ summary: 'Listar todos los tickets (admin)' })
  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @ApiOperation({ summary: 'Obtener ticket' })
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.CLIENT)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketsService.findById(id);
  }

  @ApiOperation({ summary: 'Historial por cliente' })
  @Roles(UserRole.ADMIN, UserRole.CLIENT)
  @Get('client/:id')
  byClient(@Param('id') id: string, @CurrentUser() user: any) {
    return this.ticketsService.findByClient(id, user);
  }

  @ApiOperation({ summary: 'Tickets por técnico' })
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN)
  @Get('technician/:id')
  byTechnician(@Param('id') id: string, @CurrentUser() user: any) {
    return this.ticketsService.findByTechnician(id, user);
  }

  @ApiOperation({ summary: 'Actualizar status' })
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() data: UpdateStatusDto) {
    return this.ticketsService.updateStatus(id, data);
  }

  @ApiOperation({ summary: 'Actualizar ticket (prioridad/asignación)' })
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateTicketDto) {
    return this.ticketsService.updateTicket(id, data);
  }
}
