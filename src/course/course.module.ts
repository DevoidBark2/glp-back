import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../user/entity/user.entity';
import { CourseEntity } from './entity/course.entity';
import { CategoryEntity } from '../category/entity/category.entity';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CourseEntity, User, CategoryEntity]),
    JwtModule,
    EventsModule,
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
