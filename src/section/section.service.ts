import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../user/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SectionEntity } from './entity/section.entity';
import { CreateSectionCourseDto } from './dto/create_section_course.dto';
import { StatusSectionEnum } from './enum/status_section.enum';
import { MainSection } from './entity/main-section.entity';

@Injectable()
export class SectionService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(MainSection) private readonly mainSectionRepository: Repository<MainSection>,
    @InjectRepository(SectionEntity)
    private readonly sectionEntityRepository: Repository<SectionEntity>,
  ) { }
  async findAll(user: User) {
    return this.sectionEntityRepository.find({
      where: { user: { id: user.id } },
      relations: {
        course: true,
        components: true,
      },
    });
  }

  async createSection(section: CreateSectionCourseDto, user: User) {
    await this.sectionEntityRepository.save({
      name: section.name,
      description: section.description,
      course: section.course,
      components: section.components,
      externalLinks: section.externalLinks,
      uploadFile: section.uploadFile,
      user: user,
      status: StatusSectionEnum.ACTIVE,
    });
  }

  async deleteSection(id: number) {
    const section = await this.sectionEntityRepository.findOne({where: {id: id}})

    if (!section) {
      throw new BadRequestException(`Раздел с ID ${id} не найден!`)
    }

    await this.sectionEntityRepository.delete(id);
  }

  async findById(id: number) {
    const section = await this.sectionEntityRepository.findOne({
      where: {id: id},
      relations: {
        course: true,
        components: true
      }
    })

    if (!section) {
      throw new BadRequestException(`Раздел с ID ${id} не найден!`)
    }

    return section;
  }

  async getMainSection(user: User) {
    return await this.mainSectionRepository.find({
      where: {
        user: {id: user.id}
      }
    })
  }
}
