import { forwardRef, Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entity/user.entity'
import { JwtModule } from '@nestjs/jwt'
import { CourseUser } from 'src/course/entity/course-user.entity'
import { AuthModule } from '../auth/auth.module'

@Module({
	imports: [
		TypeOrmModule.forFeature([User, CourseUser]),
		JwtModule,
		forwardRef(() => AuthModule)
	],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService]
})
export class UserModule {}
