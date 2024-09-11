import { Injectable } from '@nestjs/common';
import { User } from '../user/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SectionEntity } from './entity/section.entity';
import { CreateSectionCourseDto } from './dto/create_section_course.dto';
import { StatusSectionEnum } from './enum/status_section.enum';

@Injectable()
export class SectionService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(SectionEntity)
    private readonly sectionEntityRepository: Repository<SectionEntity>,
  ) {}
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
      status: StatusSectionEnum.NEW,
    });
  }
}
