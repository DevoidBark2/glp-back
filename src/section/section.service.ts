import { Injectable } from '@nestjs/common';
import { User } from '../user/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SectionEntity } from './entity/section.entity';

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
}
