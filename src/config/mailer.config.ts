import { ConfigService } from '@nestjs/config'
import { MailerOptions } from '@nestjs-modules/mailer'
import { isDev } from '../libs/common/utils/is-dev.util'

export const getMailerConfig = async (
	configService: ConfigService
): Promise<MailerOptions> => ({
	transport: {
		host: configService.get<string>('MAIL_HOST'),
		port: configService.get<string>('MAIL_PORT'),
		secure: !isDev(configService),
		auth: {
			user: configService.get<string>('MAIL_LOGIN'),
			pass: configService.get<string>('MAIL_PASSWORD')
		}
	},
	defaults: {
		from: `"Learnify Team" ${configService.get<string>('MAIL_LOGIN')}`
	}
})
