import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { ReviewService } from './review.service';
import CreateCourseReviewDto from './dto/create-course-review.dto';
import { Authorization } from 'src/auth/decorators/auth.decorator';

@Controller('')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) { }


  @Authorization()
  @Post('/course-review')
  async crateCourseReview(@Body() body: CreateCourseReviewDto, @Req() req: Request) {
    return await this.reviewService.crateCourseReview(body, req['user'])
  }

  @Get('/course-reviews')
  async getReviewCourses(@Query('courseId') courseId: number) {
    return await this.reviewService.getReviewsForCourse(courseId)
  }
}
