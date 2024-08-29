import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { SectionService } from './section.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateSectionCourseDto } from './dto/create_section_course.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../constants/contants';
import { ResponseMessage } from '../decorators/response-message.decorator';

@ApiTags('Разделы курсов')
@Controller()
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN)
  @Get('/sections')
  async getAllSectionCourse(@Req() req: Request) {
    return await this.sectionService.findAll(req['user']);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.TEACHER)
  @Post('/sections')
  @ApiBody({ type: CreateSectionCourseDto })
  @ResponseMessage('Раздел успешно создан!')
  async createSectionCourse(
    @Body() newSectionCourse: CreateSectionCourseDto,
    @Req() req: Request,
  ) {
    await this.sectionService.createSection(newSectionCourse, req['user']);
  }
}
