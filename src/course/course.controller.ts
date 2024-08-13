import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../config/multerConfig';
import {
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCourseDto } from './dto/create_course.dto';
import { ResponseCoursesInterceptor } from '../interceptors/response-courses.interceptor';
import { CourseEntity } from './entity/course.entity';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../constants/contants';
import { EventLoggingInterceptor } from '../interceptors/event-logging.interceptor';
import { LogAction } from '../decorators/log-action.decorator';
import { ActionEvent } from '../events/enum/action-event.enum';

@ApiTags('Курсы')
@UseInterceptors(EventLoggingInterceptor)
@Controller()
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get('/courses')
  @UseInterceptors(ResponseCoursesInterceptor)
  @ApiOperation({ summary: 'Get all courses' })
  async findAll(): Promise<CourseEntity[]> {
    return await this.courseService.findAll();
  }

  @Roles(UserRole.TEACHER)
  @Post('/course')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create new post' })
  @ApiBody({ type: CreateCourseDto })
  @LogAction(ActionEvent.CREATE_COURSE, 'A new course was created')
  @ApiHeader({
    name: 'authorization',
    description: 'Bearer Token',
    required: true,
  })
  async createCourse(@Body() course: CreateCourseDto, @Req() req: Request) {
    course.image = '/uploads/test.png';
    console.log('User in controller', req['user']);
    const newCourse = await this.courseService.createCourse(course, req);

    return {
      course: newCourse,
      message: 'Курс успешно создан!',
    };
  }

  @Roles(UserRole.STUDENT, UserRole.TEACHER, UserRole.SUPER_ADMIN)
  @Get('/get-user-courses')
  @LogAction(ActionEvent.ENROLL_STUDENT, 'view details of course')
  async getUserCourses(@Req() req: Request) {
    try {
      const courses = await this.courseService.getAllUserCourses(req);

      return {
        courses: courses,
      };
    } catch (e) {
      throw new BadRequestException(`Ошибка при получении данных: ${e}`);
    }
  }

  @Roles(UserRole.STUDENT, UserRole.TEACHER, UserRole.SUPER_ADMIN)
  @Delete('/course/:id')
  async deleteCourse(@Param('id') id: number) {
    await this.courseService.delete(id);
    return {
      message: 'Курс успешно удален!',
    };
  }

  @Post('publish-course')
  async publishCourse(@Body() body: { courseId: number }, @Req() req: Request) {
    return await this.courseService.publishCourse(body.courseId, req);
  }

  @Get('course-details/:id')
  async getCourseDetail(@Param('id') id: number) {
    return await this.courseService.getCourseDetails(id);
  }
}
