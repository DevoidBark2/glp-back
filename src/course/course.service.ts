import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseEntity } from './entity/course.entity';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create_course.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entity/user.entity';
import { CategoryEntity } from '../category/entity/category.entity';
import { StatusCourseEnum } from './enum/status_course.enum';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly courseEntityRepository: Repository<CourseEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryEntityRepository: Repository<CategoryEntity>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async findAll() {
    return await this.courseEntityRepository.find({
      relations: ['user', 'category'],
    });
  }

  async createCourse(createCourse: CreateCourseDto, req: Request) {
    console.log('Here');
    const currentUser: User = req['user'];

    console.log(currentUser);
    const category = await this.categoryEntityRepository.findOne({
      where: { id: createCourse.category },
    });

    console.log(createCourse);
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
      relations: ['user', 'category'],
    });
    console.log(course);
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

    return {
      message: 'Все четко!',
    };
  }

  async getCourseDetails(id: number) {
    return this.courseEntityRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        category: true,
      },
      select: {
        category: ['id'],
      },
    });
  }
}
