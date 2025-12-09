// Controlador de usuarios: endpoints protegidos para CRUD y perfil.
import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserRole } from './user.entity';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Crear usuario (solo admin)' })
  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() data: CreateUserDto) {
    const user = await this.usersService.create(data);
    return this.sanitize(user);
  }

  @ApiOperation({ summary: 'Listar usuarios (solo admin)' })
  @Get()
  @Roles(UserRole.ADMIN)
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => this.sanitize(user));
  }

  @ApiOperation({ summary: 'Actualizar usuario (solo admin)' })
  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    const user = await this.usersService.update(id, data);
    return this.sanitize(user);
  }

  @ApiOperation({ summary: 'Eliminar usuario (solo admin)' })
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @ApiOperation({ summary: 'Perfil del usuario autenticado' })
  @Get('me')
  async me(@Req() req: any) {
    const user = await this.usersService.findById(req.user?.sub);
    if (!user) return null;
    return this.sanitize(user);
  }

  private sanitize(user: User) {
    // Evita exponer password/refreshToken
    const { password, refreshToken, ...rest } = user;
    return rest;
  }
}
