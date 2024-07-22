import {Body, Controller, Post} from '@nestjs/common';
import { SectionService } from './section.service';
import {ApiBody, ApiTags} from "@nestjs/swagger";
import {CreateSectionCourseDto} from "./dto/create_section_course.dto";

@ApiTags('Разделы курсов')
@Controller('section')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {
  }
  @Post('/create-section')
  @ApiBody({type: CreateSectionCourseDto})
  async createSectionCourse(@Body() newSectionCourse: CreateSectionCourseDto) {

  }
}
