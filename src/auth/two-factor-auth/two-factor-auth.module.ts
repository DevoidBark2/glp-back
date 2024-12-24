import { Module } from '@nestjs/common'
import { TwoFactorAuthService } from './two-factor-auth.service'
import { MailService } from '../../libs/mail/mail.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Token } from '../entity/token.entity'
import { User } from '../../user/entity/user.entity'

@Module({
	imports: [TypeOrmModule.forFeature([User, Token])],
	providers: [TwoFactorAuthService, MailService]
})
export class TwoFactorAuthModule {}
