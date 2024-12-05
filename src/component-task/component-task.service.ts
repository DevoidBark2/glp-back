import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, ILike, Repository } from 'typeorm';
import { ComponentTask } from './entity/component-task.entity';
import { CreateComponentTaskDto } from './dto/create-component-task.dto';
import { User } from '../user/entity/user.entity';
import { StatusComponentTaskEnum } from './enum/status-component-task.enum';
import { AnswersComponentUser } from './entity/component-task-user.entity';
import { SaveTaskUserDto } from './dto/save-task-user.dto';
import { CourseComponentType } from './enum/course-component-type.enum';
import { SectionComponentTask } from 'src/section/entity/section-component-task.entity';
import { SectionEntity } from 'src/section/entity/section.entity';

@Injectable()
export class ComponentTaskService {
  constructor(
    @InjectRepository(ComponentTask)
    private readonly componentTaskRepository: Repository<ComponentTask>,
    @InjectRepository(SectionEntity)
    private readonly sectionRepository: Repository<SectionEntity>,
    @InjectRepository(AnswersComponentUser)
    private readonly answersComponentUserRepository: Repository<AnswersComponentUser>,
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

  async addAnswerForTask(body: SaveTaskUserDto, user: User) {
    const task = await this.componentTaskRepository.findOne({
      where: { id: body.task.id },
    });

    console.log(body.currentSection)
    const section = await this.sectionRepository.findOne({
      where: {
        id: Number(body.currentSection)
      }
    })

    console.log(section)

    if (!task) {
      throw new BadRequestException(`Задачи с ID ${body.task.id} не существует`);
    }

    const results = task.questions.map((question, index) => {
      const isCorrect = question.correctOption === body.answers[index];
      return {
        id: question.id,
        question: question.question,
        userAnswer: body.answers[index],
        correctAnswer: question.correctOption,
        isCorrect,
      };
    });

    const savedAnswers = await this.answersComponentUserRepository.save({
      user,
      task,
      answer: results,
      section: section
    })


    // console.log("Count corrct", results.filter((res) => res.isCorrect).length)
    // console.log("all question", task.questions.length)
    return {
      message: 'Ответы успешно сохранены',
      answers: savedAnswers,
    };
  }

}
