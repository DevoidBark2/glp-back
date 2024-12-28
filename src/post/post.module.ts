import { Module } from '@nestjs/common'
import { PostService } from './post.service'
import { PostController } from './post.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import PostEntity from './entity/post.entity'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { User } from '../user/entity/user.entity'
import { ModeratorsPost } from './entity/moderators-post.entity'
import { UserService } from 'src/user/user.service'
import { CourseUser } from 'src/course/entity/course-user.entity'

@Module({
	imports: [
		TypeOrmModule.forFeature([PostEntity, User, ModeratorsPost, CourseUser]),
		JwtModule
	],
	controllers: [PostController],
	providers: [PostService, UserService, JwtService]
})
export class PostModule {}
