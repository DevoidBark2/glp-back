import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ReviewCourse from './entity/review.entity';
import { Repository } from 'typeorm';
import CreateCourseReviewDto from './dto/create-course-review.dto';
import { User } from 'src/user/entity/user.entity';
import { CourseEntity } from 'src/course/entity/course.entity';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(ReviewCourse)
        private readonly reviewCourseRepository: Repository<ReviewCourse>,
        @InjectRepository(CourseEntity)
        private readonly courseRepositpry: Repository<CourseEntity>,
    ) { }

    async crateCourseReview(body: CreateCourseReviewDto, user: User) {
        const course = await this.courseRepositpry.findOne({
            where: {
                id: body.courseId
            }
        })

        if (!course) {
            throw new BadRequestException(`Курса с ID  ${body.courseId} не существует!`)
        }

        return await this.reviewCourseRepository.save({
            course: course,
            user: user,
            rating: body.rating,
            review: body.review
        })
    }
}
