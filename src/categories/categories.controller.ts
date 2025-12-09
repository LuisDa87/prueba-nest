// Controlador de categorias: endpoints protegidos para CRUD.
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Crear categoría' })
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() data: CreateCategoryDto) {
    return this.categoriesService.create(data);
  }

  @ApiOperation({ summary: 'Listar categorías' })
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.CLIENT)
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @ApiOperation({ summary: 'Obtener categoría' })
  @Roles(UserRole.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findById(id);
  }

  @ApiOperation({ summary: 'Actualizar categoría' })
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateCategoryDto) {
    return this.categoriesService.update(id, data);
  }

  @ApiOperation({ summary: 'Eliminar categoría' })
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
