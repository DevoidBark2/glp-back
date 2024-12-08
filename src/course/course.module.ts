import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../user/entity/user.entity';
import { CourseEntity } from './entity/course.entity';
import { CategoryEntity } from '../category/entity/category.entity';
import { EventsModule } from '../events/events.module';
import { CourseUser } from './entity/course-user.entity';
import { UserModule } from 'src/user/user.module';
import { AnswersComponentUser } from 'src/component-task/entity/component-task-user.entity';
import { SectionEntity } from 'src/section/entity/section.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CourseEntity,
      User,
      CategoryEntity,
      CourseUser,
      AnswersComponentUser,
      SectionEntity,
    ]),
    JwtModule,
    EventsModule,
    UserModule,
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
