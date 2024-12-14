import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserModule } from '../user/user.module'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './strategies/local.strategy'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../user/entity/user.entity'
import { SettingsEntity } from '../settings/entity/settings.entity'
import { GeneralSettingsEntity } from 'src/general-settings/entity/general-settings.entity'
import { GeneralSettingsModule } from 'src/general-settings/general-settings.module'

@Module({
	imports: [
		UserModule,
		PassportModule,
		TypeOrmModule.forFeature([User, SettingsEntity, GeneralSettingsEntity]),
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
		GeneralSettingsModule
	],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy]
})
export class AuthModule {}
