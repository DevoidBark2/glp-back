import { forwardRef, Module } from '@nestjs/common'
import { PasswordRecoveryService } from './password-recovery.service'
import { PasswordRecoveryController } from './password-recovery.controller'
import { UserService } from '../../user/user.service'
import { MailService } from '../../libs/mail/mail.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Token } from '../entity/token.entity'
import { User } from '../../user/entity/user.entity'
import { CourseUser } from '../../course/entity/course-user.entity'
import { JwtService } from '@nestjs/jwt'
import { AuthModule } from '../auth.module'

@Module({
	imports: [TypeOrmModule.forFeature([Token, User, CourseUser]), forwardRef(() => AuthModule)],
	controllers: [PasswordRecoveryController],
	providers: [PasswordRecoveryService, UserService, MailService, JwtService]
})
export class PasswordRecoveryModule { }
