import { Body, Controller, Post, Req } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/decorators/response-message.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/constants/contants';

@ApiTags("Feedbacks")
@Controller('')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @Roles(UserRole.MODERATOR,UserRole.STUDENT,UserRole.SUPER_ADMIN,UserRole.TEACHER)
  @Post('send-feedback')
  @ResponseMessage("Спасибо за отзыв!")
  async sendFeedBack(@Body() body: {message: string},@Req() req: Request) {
    console.log(body)
    return await this.feedbacksService.sendFeedBack(body.message,req['user']);
  }
}
