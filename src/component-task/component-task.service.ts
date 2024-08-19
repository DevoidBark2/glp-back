import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComponentTask } from './entity/component-task.entity';
import { CreateComponentTaskDto } from './dto/create-component-task.dto';
import { User } from '../user/entity/user.entity';

@Injectable()
export class ComponentTaskService {
  constructor(
    @InjectRepository(ComponentTask)
    private readonly componentTaskRepository: Repository<ComponentTask>,
  ) {}

  async create(componentTask: CreateComponentTaskDto, user: User) {
    return await this.componentTaskRepository.save({
      user,
      ...componentTask,
    });
  }

  async getAll(user: User) {
    console.log('USER', user);
    return this.componentTaskRepository.find({
      where: {
        user: { id: user.id },
      },
    });
  }
}
