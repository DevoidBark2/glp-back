import { forwardRef, Module } from '@nestjs/common'
import { MailConfirmationService } from './mail-confirmation.service'
import { MailConfirmationController } from './mail-confirmation.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Token } from '../entity/token.entity'
import { Account } from '../../user/entity/account.entity'
import { MailModule } from '../../libs/mail/mail.module'
import { AuthModule } from '../auth.module'
import { User } from '../../user/entity/user.entity'
import { UserService } from '../../user/user.service'
import { MailService } from '../../libs/mail/mail.service'
import { CourseUser } from '../../course/entity/course-user.entity'
import { JwtModule } from '@nestjs/jwt'

@Module({
	imports: [
		MailModule,
		JwtModule,
		forwardRef(() => AuthModule),
		TypeOrmModule.forFeature([Account, Token, User, CourseUser])
	],
	controllers: [MailConfirmationController],
	providers: [MailConfirmationService, UserService, MailService],
	exports: [MailConfirmationService]
})
export class MailConfirmationModule {}
