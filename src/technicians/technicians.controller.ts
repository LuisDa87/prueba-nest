// Controlador de tecnicos: endpoints protegidos para crear, listar y actualizar.
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';
import { TechniciansService } from './technicians.service';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';

@ApiTags('technicians')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('technicians')
export class TechniciansController {
  constructor(private readonly techniciansService: TechniciansService) {}

  @ApiOperation({ summary: 'Crear técnico' })
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() data: CreateTechnicianDto) {
    return this.techniciansService.create(data);
  }

  @ApiOperation({ summary: 'Listar técnicos' })
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN)
  @Get()
  findAll() {
    return this.techniciansService.findAll();
  }

  @ApiOperation({ summary: 'Obtener técnico' })
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.techniciansService.findById(id);
  }

  @ApiOperation({ summary: 'Actualizar técnico' })
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateTechnicianDto) {
    return this.techniciansService.update(id, data);
  }

  @ApiOperation({ summary: 'Eliminar técnico' })
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.techniciansService.remove(id);
  }
}
