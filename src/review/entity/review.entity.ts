import { CourseEntity } from "src/course/entity/course.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity('reviews')
class ReviewCourse {
    @PrimaryGeneratedColumn()
    id: number
    @Column({ type: "float" })
    rating: number
    @Column({ type: "varchar" })
    review: string
    @ManyToOne(() => User, (user) => user.reviews, { onDelete: "CASCADE" })
    user: User;

    @ManyToOne(() => CourseEntity, (course) => course.reviews, { onDelete: "CASCADE" })
    course: CourseEntity;
}

export default ReviewCourse