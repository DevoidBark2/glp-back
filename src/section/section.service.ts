import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../user/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SectionEntity } from './entity/section.entity';
import { CreateSectionCourseDto } from './dto/create_section_course.dto';
import { StatusSectionEnum } from './enum/status_section.enum';
import { MainSection } from './entity/main-section.entity';
import { MainSectionDto } from './dto/create-main-section.dto';
import { SectionComponentTask } from './entity/section-component-task.entity';

@Injectable()
export class SectionService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(SectionComponentTask) private readonly sectionComponentTaskRepository: Repository<SectionComponentTask>,
    @InjectRepository(MainSection) private readonly mainSectionRepository: Repository<MainSection>,
    @InjectRepository(SectionEntity)
    private readonly sectionEntityRepository: Repository<SectionEntity>,
  ) { }
  async findAll(user: User) {
    return this.sectionEntityRepository.find({
      where: { user: { id: user.id } },
      relations: {
        course: true,
        sectionComponents: true,
      },
    });
  }

  async createSection(section: CreateSectionCourseDto, user: User) {

    console.log(section);
    const parentSection = section.parentSection
      ? await this.mainSectionRepository.findOne({ where: { id: section.parentSection } })
      : null

    const sectionItem = await this.sectionEntityRepository.save({
      name: section.name,
      description: section.description,
      course: section.course,
      externalLinks: section.externalLinks,
      uploadFile: section.uploadFile,
      user: user,
      status: StatusSectionEnum.ACTIVE,
      parentSection: parentSection
    });

    section.components.map((component, index) => {
      this.sectionComponentTaskRepository.save({
        section: sectionItem,
        componentTask: component,
        sort: index
      })
    })
  }

  async deleteSection(id: number) {
    const section = await this.sectionEntityRepository.findOne({ where: { id: id } })

    if (!section) {
      throw new BadRequestException(`Раздел с ID ${id} не найден!`)
    }

    await this.sectionEntityRepository.delete(id);
  }

  async findById(id: number) {
    const section = await this.sectionEntityRepository.findOne({
      where: { id: id },
      relations: {
        course: true,
        sectionComponents: true
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
        user: { id: user.id }
      }
    })
  }

  async createMainSections(body: MainSectionDto, user: User) {
    return await this.mainSectionRepository.save({ ...body, user: user });
  }
}
