import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entity/user.entity'
import { JwtModule } from '@nestjs/jwt'
import { CourseUser } from 'src/course/entity/course-user.entity'

@Module({
	imports: [TypeOrmModule.forFeature([User, CourseUser]), JwtModule],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService]
})
export class UserModule {}
