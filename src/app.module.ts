import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './user/user.module'
import { PostModule } from './post/post.module'
import { join } from 'path'
import { CourseModule } from './course/course.module'
import { SectionModule } from './section/section.module'
import { CategoryModule } from './category/category.module'
import { EventsModule } from './events/events.module'
import { GeneralSettingsModule } from './general-settings/general-settings.module'
import { ComponentTaskModule } from './component-task/component-task.module'
import { StatisticsModule } from './statistics/statistics.module'
import { FeedbacksModule } from './feedbacks/feedbacks.module'
import { AchievementsModule } from './achievements/achievements.module'
import { FaqModule } from './faq/faq.module'
import { SupportModule } from './support/support.module'
import { IS_DEV_ENV } from './libs/common/utils/is-dev.util'
import { ProviderModule } from './auth/provider/provider.module'
import { MailModule } from './libs/mail/mail.module'
import { MailConfirmationModule } from './auth/mail-confirmation/mail-confirmation.module'
import { PasswordRecoveryModule } from './auth/password-recovery/password-recovery.module'
import { TwoFactorAuthModule } from './auth/two-factor-auth/two-factor-auth.module'
import { CommentsModule } from './comments/comments.module'
import { ExamsModule } from './exams/exams.module'
import { ReviewModule } from './review/review.module'
import { ThreeModelModule } from './three-model/three-model.module'
import { UsersLevelsModule } from './users-levels/users-levels.module'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { CoinsModule } from './coins/coins.module'
import { XpModule } from './xp/xp.module'
import { FramesModule } from './customize/frames/frames.module'
import { IconsModule } from './customize/icons/icons.module'
import { EffectsModule } from './customize/effects/effects.module'
import { CustomizeModule } from './customize/customize.module'
import { PurchasesModule } from './customize/purchases/purchases.module'
import { BullModule } from '@nestjs/bull'
import { CertificateService } from './certificate/certificate.service'
import { CertificateModule } from './certificate/certificate.module'
import { ServeStaticModule } from '@nestjs/serve-static'

@Module({
	imports: [
		EventEmitterModule.forRoot(),
		ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: !IS_DEV_ENV }),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.get('POSTGRES_HOST'),
				port: configService.get('POSTGRES_PORT'),
				username: configService.get('POSTGRES_USERNAME'),
				password: configService.get('POSTGRES_PASSWORD'),
				database: configService.get('POSTGRES_DB_NAME'),
				synchronize: true,
				logging: false,
				// migrationsRun: false,
				// migrationsTableName: 'typeorm_migration',
				entities: [__dirname + '/**/*.entity{.ts,.js}']
			}),
			inject: [ConfigService]
		}),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'src', 'uploads'),
			serveRoot: '/uploads'
		}),
		BullModule.forRoot({
			redis: {
				host: 'localhost',
				port: 6379,
				password: 'password'
			}
		}),
		AuthModule,
		UserModule,
		PostModule,
		CourseModule,
		SectionModule,
		CategoryModule,
		EventsModule,
		GeneralSettingsModule,
		ComponentTaskModule,
		StatisticsModule,
		FeedbacksModule,
		AchievementsModule,
		FaqModule,
		SupportModule,
		ProviderModule,
		MailModule,
		MailConfirmationModule,
		PasswordRecoveryModule,
		TwoFactorAuthModule,
		CommentsModule,
		ExamsModule,
		ReviewModule,
		ThreeModelModule,
		UsersLevelsModule,
		CoinsModule,
		XpModule,
		FramesModule,
		IconsModule,
		EffectsModule,
		CustomizeModule,
		PurchasesModule,
		CertificateModule
	],
	providers: [CertificateService]
})
export class AppModule {}
