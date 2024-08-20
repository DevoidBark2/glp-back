import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { SectionService } from './section.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateSectionCourseDto } from './dto/create_section_course.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../constants/contants';

@ApiTags('Разделы курсов')
@Controller()
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN)
  @Get('/sections')
  async getAllSectionCourse(@Req() req: Request) {
    return await this.sectionService.findAll(req['user']);
  }

  @Post('/create-section')
  @ApiBody({ type: CreateSectionCourseDto })
  async createSectionCourse(@Body() newSectionCourse: CreateSectionCourseDto) {
    return newSectionCourse;
  }
}
