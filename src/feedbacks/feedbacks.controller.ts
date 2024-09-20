import { Body, Controller, Get, Post, Req, UploadedFiles, UseFilters, UseInterceptors } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/decorators/response-message.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/constants/contants';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { feedbacksMulterConfig } from './multerConfig/feedBackMulterConfig';
import { FileLimitExceptionFilter } from './filters/fileLimitFilter.filter';

@ApiTags("Feedbacks")
@Controller('')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @Roles(UserRole.MODERATOR,UserRole.STUDENT,UserRole.SUPER_ADMIN,UserRole.TEACHER)
  @Post('send-feedback')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 10 }], feedbacksMulterConfig))
  @ResponseMessage("Спасибо за отзыв!")
  // @UseFilters(new FileLimitExceptionFilter())
  async sendFeedBack(@Body() body: {message: string},@Req() req: Request, @UploadedFiles() files: { files?: Express.Multer.File[] }) {
    return this.feedbacksService.sendFeedBack(body.message, req['user'], files.files);
  }

  @Roles(UserRole.MODERATOR,UserRole.STUDENT,UserRole.SUPER_ADMIN,UserRole.TEACHER)
  @Get('get-feedback-user')
  async getFeedBackForUser(@Req() req: Request) {
    return this.feedbacksService.getFeedBackForUser(req['user']);
  }
}
