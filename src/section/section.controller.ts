import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { SectionService } from './section.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateSectionCourseDto } from './dto/create_section_course.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../constants/contants';
import { ResponseMessage } from '../decorators/response-message.decorator';
import { MainSectionDto } from './dto/create-main-section.dto';

@ApiTags('Разделы курсов')
@Controller()
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN)
  @Get('/sections')
  async getAllSectionCourse(@Req() req: Request) {
    return await this.sectionService.findAll(req['user']);
  }

  @Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN)
  @Get('/sections/:id')
  async getSectionCourseById(@Param('id') id: number) {
    return await this.sectionService.findById(id);
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

  @Roles(UserRole.SUPER_ADMIN, UserRole.TEACHER)
  @Delete('/sections/:id')
  @ResponseMessage("Раздел успешно удален!")
  async deleteSectionCourse(@Param('id') id: number) {
    await this.sectionService.deleteSection(id);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.TEACHER)
  @Get('main-section')
  async getMainSections(@Req() req: Request) {
    return await this.sectionService.getMainSection(req['user']);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.TEACHER)
  @Post('main-section')
  async createMainSections(@Body() body: MainSectionDto,@Req() req: Request) {
    return await this.sectionService.createMainSections(body, req['user']);
  }
}
