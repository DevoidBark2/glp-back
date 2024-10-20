import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseEntity } from './entity/course.entity';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create_course.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entity/user.entity';
import { CategoryEntity } from '../category/entity/category.entity';
import { StatusCourseEnum } from './enum/status_course.enum';
import { ChangeCourseDto } from './dto/change-course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly courseEntityRepository: Repository<CourseEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryEntityRepository: Repository<CategoryEntity>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  async findAll() {
    return await this.courseEntityRepository.find({
      relations: ['user', 'category'],
    });
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

  async getAllUserCourses(req: Request) {
    const user: User = req['user'];

    return await this.courseEntityRepository.find({
      where: { user: { id: user.id } },
      relations: {
        category: true,
      },
    });
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
          components: true,
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
    console.log(course);
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
}
