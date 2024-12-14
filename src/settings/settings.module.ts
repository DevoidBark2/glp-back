import { Module } from '@nestjs/common'
import { SettingsService } from './settings.service'
import { SettingsController } from './settings.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SettingsEntity } from './entity/settings.entity'
import { User } from '../user/entity/user.entity'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
	imports: [
		TypeOrmModule.forFeature([SettingsEntity, User]),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				secret: configService.get('JWT_SECRET'),
				signOptions: {
					expiresIn: '24h'
				}
			}),
			inject: [ConfigService]
		})
	],
	controllers: [SettingsController],
	providers: [SettingsService]
})
export class SettingsModule {}
