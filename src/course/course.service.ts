import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {CourseEntity} from "./entity/course.entity";
import {Repository} from "typeorm";
import {CreateCourseDto} from "./dto/create_course.dto";
import {JwtService} from "@nestjs/jwt";
import {User} from "../user/entity/user.entity";
import {CategoryEntity} from "../category/entity/category.entity";

@Injectable()
export class CourseService {
    constructor(
        @InjectRepository(CourseEntity) private readonly courseEntityRepository: Repository<CourseEntity>,
        @InjectRepository(CategoryEntity) private readonly categoryEntityRepository: Repository<CategoryEntity>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) {}

    async getAllCourses(){
        const courses = await this.courseEntityRepository.find({
            relations: ['user','category'],
        });

        return courses.map(course => {
           return {
               id: course.id,
               name: course.name,
               image: course.image,
               category: course.category,
               access_right: course.access_right,
               level: course.level,
               description: course.description,
               teacher: {
                   id: course.user.id,
                   name: `${course.user.first_name} ${course.user.second_name} ${course.user.last_name}`,
                   email: course.user.email
               }
           }
       });
    }

    async createCourse(createCourse: CreateCourseDto, token: string) {

        console.log(createCourse)
        const decodedToken = await this.jwtService.decode(token);

        const user = await this.userRepository.findOne({ where: { id: decodedToken.id } });

        const category = await this.categoryEntityRepository.findOne({ where: { id: createCourse.category } });

        const newCourse = new CourseEntity();
        newCourse.name = createCourse.name;
        newCourse.description = createCourse.description;
        newCourse.category = category; // Pass the actual CategoryEntity object
        newCourse.access_right = Number(createCourse.access_right);
        newCourse.duration = createCourse.duration;
        newCourse.level = Number(createCourse.level);
        newCourse.publish_date = createCourse.publish_date;
        newCourse.image = createCourse.image;
        newCourse.user = user; // Pass the actual User entity

        console.log(newCourse)

        return await this.courseEntityRepository.save(newCourse);
    }

    async getAllUserCourses(token:string){
        const decodedToken = await this.jwtService.decode(token)

        const user = await this.userRepository.findOne({where: {id: decodedToken.id}})

        const courses = await this.courseEntityRepository.find({where: {user: user}});

        return courses;
    }
}
