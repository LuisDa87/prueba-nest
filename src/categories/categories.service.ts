// Servicio de categorias: CRUD y validaciones de unicidad de nombre.
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async create(data: CreateCategoryDto) {
    const exists = await this.categoriesRepository.findOne({ where: { name: data.name } });
    if (exists) throw new BadRequestException('Categoría ya existe');
    const category = this.categoriesRepository.create(data);
    return this.categoriesRepository.save(category);
  }

  findAll() {
    return this.categoriesRepository.find({ order: { name: 'ASC' } });
  }

  async findById(id: string) {
    const category = await this.categoriesRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Categoría no encontrada');
    return category;
  }

  async update(id: string, data: UpdateCategoryDto) {
    const category = await this.findById(id);
    if (data.name && data.name !== category.name) {
      const exists = await this.categoriesRepository.findOne({ where: { name: data.name } });
      if (exists) throw new BadRequestException('Nombre ya usado');
    }
    Object.assign(category, data);
    return this.categoriesRepository.save(category);
  }

  async remove(id: string) {
    const category = await this.findById(id);
    await this.categoriesRepository.remove(category);
    return { id };
  }
}
