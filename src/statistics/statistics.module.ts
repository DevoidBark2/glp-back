import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { CourseEntity } from '../course/entity/course.entity';
import PostEntity from '../post/entity/post.entity';
import { SectionEntity } from '../section/entity/section.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, CourseEntity, PostEntity, SectionEntity]),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
