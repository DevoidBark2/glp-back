import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoryEntity } from './entity/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ChangeCategoryDto } from './dto/change-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryEntityRepository: Repository<CategoryEntity>,
  ) {}

  async getAll() {
    try {
      return this.categoryEntityRepository.find();
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async create(category: CreateCategoryDto) {
    const createdCategory = await this.categoryEntityRepository.save(category);
    return {
      category: createdCategory,
      message: 'Категория успешно создана!',
    };
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
}
