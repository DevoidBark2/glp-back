import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, ILike, Repository } from 'typeorm';
import { ComponentTask } from './entity/component-task.entity';
import { CreateComponentTaskDto } from './dto/create-component-task.dto';
import { User } from '../user/entity/user.entity';
import { StatusComponentTaskEnum } from './enum/status-component-task.enum';

@Injectable()
export class ComponentTaskService {
  constructor(
    @InjectRepository(ComponentTask)
    private readonly componentTaskRepository: Repository<ComponentTask>,
  ) { }

  async create(componentTask: CreateComponentTaskDto, user: User) {
    return await this.componentTaskRepository.save({
      user,
      ...componentTask,
    });
  }

  async getAll(user: User) {
    return this.componentTaskRepository.find({
      where: {
        user: { id: user.id },
      },
      order: {
        id: 'ASC',
      },
    });
  }

  async change(component: CreateComponentTaskDto, user: User) {
    await this.componentTaskRepository.update(component.id, {
      user: user,
      ...component,
    });
  }

  async delete(componentId: number, user: User) {
    const componentTask = await this.componentTaskRepository.findOne({
      where: { id: componentId, user: user },
    });

    if (!componentTask) {
      throw 'Ошибка при удалении компонента!';
    }
    await this.componentTaskRepository.delete(componentId);
  }

  async searchComponent(query: string, user: User) {
    const queryString = `%${query}%`;

    return await this.componentTaskRepository
      .createQueryBuilder('component_task')
      .where('component_task.userId = :userId', { userId: user.id })
      .andWhere(
        new Brackets((qb) => {
          qb.where('component_task.title ILIKE :queryString', { queryString })
            .orWhere('component_task.status = :status', { status: StatusComponentTaskEnum.ACTIVATED })
            .orWhere("component_task.tags::jsonb @> :tagQuery", { tagQuery: JSON.stringify([query]) });
        })
      )
      .getMany();
  }

  async getComponentById(id: number) {
    return await this.componentTaskRepository.findOne({
      where: { id: id },
    });
  }
}
