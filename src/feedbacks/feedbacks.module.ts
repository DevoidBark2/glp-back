import { Module } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksController } from './feedbacks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedBackEntity } from './entity/feedback.entity';
import { User } from 'src/user/entity/user.entity';
import { FeedbackAttachmentEntity } from './entity/feedback-attachment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeedBackEntity, User, FeedbackAttachmentEntity]),
  ],
  controllers: [FeedbacksController],
  providers: [FeedbacksService],
})
export class FeedbacksModule {}
