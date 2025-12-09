// Controlador de clientes: endpoints admin para CRUD de clientes.
import { Body, Controller, Get, Param, Patch, Post, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { ClientsService } from './clients.service';
import { UpdateClientDto } from './dto/update-client.dto';

@ApiTags('clients')
@ApiBearerAuth()
@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @ApiOperation({ summary: 'Listar clientes' })
  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  @ApiOperation({ summary: 'Crear cliente' })
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() data: CreateClientDto) {
    return this.clientsService.create(data);
  }

  @ApiOperation({ summary: 'Consultar cliente' })
  @Roles(UserRole.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findById(id);
  }

  @ApiOperation({ summary: 'Actualizar cliente' })
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateClientDto) {
    return this.clientsService.update(id, data);
  }

  @ApiOperation({ summary: 'Eliminar cliente' })
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }
}
