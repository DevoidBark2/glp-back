import { forwardRef, Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserModule } from '../user/user.module'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './strategies/local.strategy'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../user/entity/user.entity'
import { GeneralSettingsEntity } from 'src/general-settings/entity/general-settings.entity'
import { GeneralSettingsModule } from 'src/general-settings/general-settings.module'
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha'
import { getRecaptchaConfig } from '../config/recaptcha.config'
import { ProviderModule } from './provider/provider.module'
import { getProvidersConfig } from '../config/providers.config'
import { Account } from '../user/entity/account.entity'
import { MailConfirmationModule } from './mail-confirmation/mail-confirmation.module'
import { MailService } from '../libs/mail/mail.service'
import { UserService } from '../user/user.service'
import { CourseUser } from '../course/entity/course-user.entity'
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service'
import { Token } from './entity/token.entity'
import { EventEntity } from '../events/entity/event.entity'
import { UserLevel } from '../users-levels/entity/user-level.entity'
import { UsersLevelsModule } from '../users-levels/users-levels.module'
import { SectionModule } from 'src/section/section.module'

@Module({
	imports: [
		forwardRef(() => UserModule),
		forwardRef(() => UsersLevelsModule),
		PassportModule,
		TypeOrmModule.forFeature([
			User,
			GeneralSettingsEntity,
			Account,
			CourseUser,
			Token,
			EventEntity,
			UserLevel
		]),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				secret: configService.get('JWT_SECRET'),
				signOptions: {
					expiresIn: '24h'
				}
			}),
			inject: [ConfigService]
		}),
		GeneralSettingsModule,
		GoogleRecaptchaModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getRecaptchaConfig,
			inject: [ConfigService]
		}),
		ProviderModule.registerAsync({
			imports: [ConfigModule],
			useFactory: getProvidersConfig,
			inject: [ConfigService]
		}),
		forwardRef(() => MailConfirmationModule,),
		forwardRef(() => SectionModule)
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		LocalStrategy,
		MailService,
		UserService,
		TwoFactorAuthService
	],
	exports: [AuthService, TwoFactorAuthService]
})
export class AuthModule { }
