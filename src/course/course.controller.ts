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
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCourseDto } from './dto/create_course.dto';
import { ResponseCoursesInterceptor } from '../interceptors/response-courses.interceptor';
import { CourseEntity } from './entity/course.entity';

@ApiTags('Курсы')
@Controller()
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get('/courses')
  @UseInterceptors(ResponseCoursesInterceptor)
  @ApiOperation({ summary: 'Get all courses' })
  async findAll(): Promise<CourseEntity[]> {
    return await this.courseService.findAll();
  }

  @Post('/course')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create new post' })
  @ApiBody({ type: CreateCourseDto })
  @ApiHeader({
    name: 'authorization',
    description: 'Bearer Token',
    required: true,
  })
  async createCourse(@Body() course: CreateCourseDto, @Req() req: Request) {
    console.log(course);
    course.image = '/uploads/test.png';
    const userToken = req.headers['authorization'];
    const newCourse = await this.courseService.createCourse(course, userToken);

    return {
      course: newCourse,
      message: 'Курс успешно создан!',
    };
  }

  @Get('/get-user-courses')
  @ApiQuery({ name: 'token', description: 'Token' })
  async getUserCourses(@Req() req: Request) {
    try {
      const token = req.headers['authorization'];
      const courses = await this.courseService.getAllUserCourses(token);

      return {
        courses: courses,
      };
    } catch (e) {
      throw new BadRequestException(`Ошибка при получении данных: ${e}`);
    }
  }

  @Delete('/course/:id')
  async deleteCourse(@Param('id') id: number) {
    console.log(typeof id);
  }
}
