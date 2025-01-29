import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './user/user.module'
import { PostModule } from './post/post.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { SettingsModule } from './settings/settings.module'
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
import { CommentsModule } from './comments/comments.module';
import { ExamsModule } from './exams/exams.module';
import { ReviewModule } from './review/review.module';

@Module({
	imports: [
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
		AuthModule,
		UserModule,
		PostModule,
		SettingsModule,
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
		ReviewModule
	]
	// providers: [
	// 	WebsocketGateway,
	// 	{
	// 		provide: APP_GUARD,
	// 		useClass: AuthGuards
	// 	}
	// ]
})
export class AppModule { }
