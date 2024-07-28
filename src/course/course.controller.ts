import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { CourseService } from './course.service';
import {FileInterceptor} from "@nestjs/platform-express";
import {multerOptions} from "../config/multerConfig";
import {ApiBearerAuth, ApiBody, ApiConsumes, ApiHeader, ApiParam, ApiQuery, ApiTags} from "@nestjs/swagger";
import {CreatePostDto} from "../post/dto/create.dto";
import {CreateCourseDto} from "./dto/create_course.dto";

@ApiTags("Курсы")
@Controller('api')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}


  @Get('/get-all-courses')
  async getAllCourses(){
    try{
      const courses = await this.courseService.getAllCourses();

      return {
        courses: courses
      }
    }catch (e){
      throw new BadRequestException(`Ошибка при получении курсов: ${e}`)
    }
  }

  @Post('/create-course')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiBody({type: CreateCourseDto})
  @ApiBearerAuth("token")
  @ApiHeader({
    name: 'authorization',
    description: 'Bearer Token',
    required: true
  })
  async createCourse(@Body() course : CreateCourseDto,@Req() req: Request){
    try{
      console.log(course)
      course.image = "/uploads/test.png";
      const userToken = req.headers["authorization"]
      const newCourse = await this.courseService.createCourse(course,userToken)

      return {
        message: "Курс успешно создан!"
      }
    }catch (e){
      throw new BadRequestException(`Ошибка при создании курса: ${e}`)
    }
  }

  @Get('/get-user-courses')
  @ApiQuery({ name: 'token', description: 'Token' })
  async getUserCourses(@Req() req: Request){
    try{
      const token = req.headers['authorization']
      const courses = await this.courseService.getAllUserCourses(token)

      return {
        courses: courses
      }
    }catch (e){
      throw new BadRequestException(`Ошибка при получении данных: ${e}`)
    }
  }
}
