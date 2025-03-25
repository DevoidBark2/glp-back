import { Module } from '@nestjs/common'
import { ReviewService } from './review.service'
import { ReviewController } from './review.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import ReviewCourse from './entity/review.entity'
import { UserModule } from 'src/user/user.module'
import { CourseEntity } from 'src/course/entity/course.entity'

@Module({
	imports: [
		TypeOrmModule.forFeature([ReviewCourse, CourseEntity]),
		UserModule
	],
	controllers: [ReviewController],
	providers: [ReviewService]
})
export class ReviewModule {}
