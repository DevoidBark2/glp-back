import { Body, Controller, Post, Req } from '@nestjs/common';
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
}
