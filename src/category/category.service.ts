import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoryEntity } from './entity/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ChangeCategoryDto } from './dto/change-category.dto';
import { CourseEntity } from '../course/entity/course.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryEntityRepository: Repository<CategoryEntity>,
    @InjectRepository(CourseEntity)
    private readonly courseEntityRepository: Repository<CourseEntity>,
  ) { }

  async getAll() {
    try {
      return this.categoryEntityRepository.find({ order: { id: 'ASC' } });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async create(category: CreateCategoryDto) {
    return await this.categoryEntityRepository.save(category);
  }

  async delete(id: number) {
    const category = await this.categoryEntityRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!category) {
      throw new BadRequestException(`Категории с ID ${id} не существует!`);
    }

    await this.categoryEntityRepository.delete(category);
    return {
      message: 'Категория успешно удалена!',
    };
  }

  async change(body: ChangeCategoryDto) {
    const category = await this.categoryEntityRepository.findOne({
      where: { id: body.id },
    });

    if (!category) {
      throw new BadRequestException(`Категории с ID ${body.id} не существует!`);
    }

    await this.categoryEntityRepository.update(body.id, body);
  }

  async isPossibleDeleteCategory(id: number) {
    const category = await this.categoryEntityRepository.findOne({
      where: { id: id },
    });

    return await this.courseEntityRepository.find({
      where: {
        category: category,
      },
      relations: {
        category: true,
      },
    });
  }
}
