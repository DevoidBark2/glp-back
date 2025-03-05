import { Body, Controller, Delete, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ReviewService } from './review.service';
import CreateCourseReviewDto from './dto/create-course-review.dto';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { ResponseMessage } from 'src/decorators/response-message.decorator';

@Controller('')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) { }


  @Authorization()
  @Post('/course-review')
  @ResponseMessage("Комментарий успешно добавлен.")
  async crateCourseReview(@Body() body: CreateCourseReviewDto, @Req() req: Request) {
    return await this.reviewService.crateCourseReview(body, req['user'])
  }

  @Get('/course-reviews')
  async getReviewCourses(@Query('courseId') courseId: number) {
    return await this.reviewService.getReviewsForCourse(courseId)
  }

  @Authorization()
  @Delete('/course-reviews/:id')
  @ResponseMessage("Комментарий успешно удален.")
  async deleteReviewCourses(@Param('id') id: number) {
    return await this.reviewService.deleteReviewsForCourse(id)
  }
}
