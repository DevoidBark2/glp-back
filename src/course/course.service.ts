import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseEntity } from './entity/course.entity';
import { In, Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create_course.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entity/user.entity';
import { CategoryEntity } from '../category/entity/category.entity';
import { StatusCourseEnum } from './enum/status_course.enum';
import { ChangeCourseDto } from './dto/change-course.dto';
import { UserRole } from 'src/constants/contants';
import { SubscribeCourseDto } from './dto/subsribe-course.dto';
import { CourseUser } from './entity/course-user.entity';
import { UserService } from 'src/user/user.service';
import { AnswersComponentUser } from 'src/component-task/entity/component-task-user.entity';
import { SectionEntity } from 'src/section/entity/section.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly courseEntityRepository: Repository<CourseEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryEntityRepository: Repository<CategoryEntity>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @InjectRepository(CourseUser)
    private readonly courseUserRepository: Repository<CourseUser>,
    @InjectRepository(AnswersComponentUser)
    private readonly answersComponentUserRepository: Repository<AnswersComponentUser>,
    @InjectRepository(SectionEntity)
    private readonly sectionRepository: Repository<SectionEntity>,
  ) { }

  async findAll(req: Request) {
    const userToken = req.headers['authorization'] as string | undefined;

    if (!userToken) {
      return await this.courseEntityRepository.find({
        relations: {
          category: true,
          user: true,
        },
        select: {
          user: {
            id: true,
            first_name: true,
            second_name: true,
            last_name: true
          }
        }
      });
    }

    // Get user from token
    const user = await this.userService.getUserByToken(userToken);

    // If user does not exist (invalid token), return all courses as in the first case
    if (!user) {
      return await this.courseEntityRepository.find({
        relations: {
          category: true,
          user: true,
        },
        select: {
          user: {
            id: true,
            first_name: true,
            second_name: true,
            last_name: true
          }
        }
      });
    }

    // Fetch courses related to the specific user in courseUsers, with a conditional check
    const coursesForUser = await this.courseEntityRepository.find({
      relations: {
        category: true,
        courseUsers: true,
        user: true
      }
    });

    coursesForUser.map(it => {
      return {
        ...it,
        inCourse: it.courseUsers.length > 0
      }
    })
    return coursesForUser;
  }



  async createCourse(createCourse: CreateCourseDto, req: Request) {
    const currentUser: User = req['user'];

    const category = createCourse.category
      ? await this.categoryEntityRepository.findOne({
        where: { id: createCourse.category },
      })
      : null;

    const newCourse = new CourseEntity();
    newCourse.name = createCourse.name;
    newCourse.small_description = createCourse.small_description;
    newCourse.content_description = createCourse.content_description;
    newCourse.category = category;
    newCourse.access_right = createCourse.access_right;
    newCourse.duration = createCourse.duration;
    newCourse.level = createCourse.level;
    newCourse.publish_date = createCourse.publish_date;
    newCourse.image = createCourse.image;
    newCourse.user = currentUser;
    newCourse.status = StatusCourseEnum.NEW;

    return await this.courseEntityRepository.save(newCourse);
  }

  async getAllUserCourses(user: User) {
    const courses = user.role === UserRole.SUPER_ADMIN ? this.courseEntityRepository.find({
      relations: {
        category: true,
        user: true
      },
      order: {
        user: {
          role: "DESC"
        }
      }
    }) : await this.courseEntityRepository.find({
      where: { user: { id: user.id } },
      relations: {
        category: true,
      },
      order: {
        user: {
          role: "DESC"
        }
      }
    });

    return courses;
  }

  async delete(courseId: number) {
    const course = await this.courseEntityRepository.findOne({
      where: {
        id: courseId,
      },
    });

    if (course.status === StatusCourseEnum.IN_PROCESSING) {
      throw new BadRequestException(
        'В данный момент курс в обработке, ожидайте ответа от модератора',
      );
    }

    if (course.status === StatusCourseEnum.ACTIVE) {
      throw new BadRequestException(
        'Курс сейчас опубликован, его нельзя удалить!',
      );
    }

    await this.courseEntityRepository.delete(courseId);
  }

  async publishCourse(courseId: number, req: Request) {
    const course = await this.courseEntityRepository.findOne({
      where: { id: courseId },
      relations: {
        sections: true,
      },
    });

    if (course.sections.length < 1) {
      throw new BadRequestException(
        'Данный курс нельзя отправить,так как в нем нет,как минимум 1 раздела',
      );
    }

    await this.courseEntityRepository.update(courseId, {
      status: StatusCourseEnum.IN_PROCESSING,
    });
  }

  async getCourseDetails(id: number) {
    const course = await this.courseEntityRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        category: true,
        sections: {
          sectionComponents: true,
        },
      },
    });

    if (course.status === StatusCourseEnum.IN_PROCESSING) {
      throw 'Курс находится в обработке,получить доступ к нему нельзя';
    }

    return course;
  }

  async changeCourse(course: ChangeCourseDto, user: User) {
    const category = await this.categoryEntityRepository.findOne({
      where: {
        id: course.category,
      },
    });

    await this.courseEntityRepository.update(course.id, {
      name: course.name,
      image: course.image,
      small_description: course.small_description,
      category: category,
      access_right: course.access_right,
      duration: course.duration,
      level: course.level,
      publish_date: course.publish_date,
      content_description: course.content_description,
      secret_key: course.secret_key,
      status: course.status,
      user: user,
    });
  }

  async getFullCourseById(courseId: number, user: User) {
    const course = await this.courseEntityRepository.findOne({
      where: { id: courseId },
      relations: {
        sections: {
          sectionComponents: {
            componentTask: true,
          },
          parentSection: true,
        },
      },
      order: {
        sections: {
          sectionComponents: { sort: "ASC" },
          parentSection: { sort: "ASC" },
          sort: "ASC",
        },
      },
    });

    if (!course) {
      throw new Error(`Course with ID ${courseId} not found`);
    }

    const sections = course.sections;

    if (!sections || sections.length === 0) {
      return {
        courseId: course.id,
        courseName: course.name,
        sections: [],
      };
    }

    // Получение всех уникальных пар (task.id, section.id)
    const taskSectionPairs = sections
      .flatMap((section) =>
        section.sectionComponents.map((component) => ({
          taskId: component.componentTask?.id,
          sectionId: section.id,
        }))
      )
      .filter(({ taskId }) => !!taskId);

    // Получение ответов пользователя с учетом связи task <-> section
    const userAnswers = await this.answersComponentUserRepository.find({
      where: {
        user: { id: user.id },
        task: { id: In(taskSectionPairs.map((pair) => pair.taskId)) },
        section: { id: In(taskSectionPairs.map((pair) => pair.sectionId)) },
      },
      relations: ["task", "section"],
    });

    // Преобразуем ответы в Map для быстрого доступа
    const userAnswersMap = new Map(
      userAnswers.map((answer) => [`${answer.task.id}-${answer.section.id}`, answer])
    );

    // Карта для группировки секций по parentSection.id
    const mainSectionMap = new Map<number, any>(); // Храним MainSection и его секции
    const rootSections: any[] = []; // Секции без parentSection (корневые)

    sections.forEach((section) => {
      if (section.parentSection) {
        const mainSectionId = section.parentSection.id;

        // Если MainSection еще не в карте, инициализируем
        if (!mainSectionMap.has(mainSectionId)) {
          mainSectionMap.set(mainSectionId, {
            id: mainSectionId,
            name: section.parentSection.title,
            children: [],
          });
        }

        // Добавляем текущую секцию как дочернюю к ее MainSection
        mainSectionMap.get(mainSectionId).children.push({
          id: section.id,
          name: section.name,
          ...section,
          children: [],
        });
      } else {
        // Если секция не привязана к MainSection, она корневая
        rootSections.push({
          id: section.id,
          name: section.name,
          ...section,
          children: [],
        });
      }

      // Добавляем ответы в компонент задачи только если они есть
      section.sectionComponents.forEach((component) => {
        if (component.componentTask) {
          const taskId = component.componentTask.id;
          const sectionId = section.id;
          const userAnswer = userAnswersMap.get(`${taskId}-${sectionId}`);
          if (userAnswer) {
            component.componentTask.userAnswer = userAnswer.answer;
          }
          else {
            component.componentTask.userAnswer = null
          }
        }
      });
    });

    // Преобразуем Map в массив для возвращаемого результата
    const groupedSections = [...mainSectionMap.values(), ...rootSections];

    // Возвращаем результат
    return {
      courseId: course.id,
      name: course.name,
      sections: groupedSections, // Группированные секции с ответами пользователя
    };
  }






  async subscribeCourse(body: SubscribeCourseDto) {
    const course = await this.courseEntityRepository.findOne({ where: { id: body.courseId } })

    if (!course) {
      throw new BadRequestException(`Курс с ID ${body.courseId} не найден!`)
    }

    const user = await this.userRepository.findOne({ where: { id: body.userId } })

    if (!user) {
      throw new BadRequestException(`Пользователь с ID ${body.courseId} не найден!`)
    }

    return await this.courseUserRepository.save({
      user: user,
      course: course
    })
  }

  async leaveCourse(id: number, user: User) {
    const course = await this.courseEntityRepository.findOne({ where: { id: id } })
    const courseUser = await this.courseUserRepository.findOne({
      where: {
        user: user,
        course: course
      }
    })


    if (!course) {
      throw new BadRequestException(`Курс с ID ${id} не найден!`)
    }

    await this.courseUserRepository.delete(courseUser.id)
  }
}
