import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as process from 'process'
import { ResponseInterceptor } from './interceptors/response.interceptor'
import { ValidationPipe } from '@nestjs/common'
import helmet from 'helmet'
import express from 'express'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import { join } from 'path'
import { ConfigService } from '@nestjs/config'
import IORedis from 'ioredis'
import session from 'express-session'
import { ms, StringValue } from './libs/common/utils/ms.util'
import { parseBoolean } from './libs/common/utils/pasrse-boolean.util'
import { RedisStore } from 'connect-redis'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const reflector = app.get(Reflector)

	const config = app.get(ConfigService)
	const redis = new IORedis(config.get('REDIS_URI'))

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true
		})
	)

	app.use(cookieParser(config.get('COOKIES_SECRET')))

	app.enableCors({
		origin: config.get<string>('CLIENT_URL'),
		credentials: true,
		exposedHeaders: ['set-cookie']
	})

	app.use(
		session({
			secret: config.get('SESSION_SECRET'),
			name: config.get('SESSION_NAME'),
			resave: true,
			saveUninitialized: false,
			cookie: {
				domain: config.get('SESSION_DOMAIN'),
				maxAge: ms(config.get<StringValue>('SESSION_MAX_AGE')),
				httpOnly: parseBoolean(config.get<string>('SESSION_HTTP_ONLY')),
				secure: parseBoolean(config.get<string>('SESSION_SECURE')),
				sameSite: 'lax'
			},
			store: new RedisStore({
				client: redis,
				prefix: config.get('SESSION_FOLDER')
			})
		})
	)

	app.setGlobalPrefix('api')

	app.useGlobalInterceptors(new ResponseInterceptor(reflector))

	app.use(helmet())
	app.use(compression())
	app.use(cookieParser())

	const swaggerConfig = new DocumentBuilder()
		.setTitle('GLP')
		.setDescription('Graph Learning Platform')
		.setVersion('1.0')
		.addBearerAuth(
			{
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT'
			},
			'access-token'
		)
		.build()

	const document = SwaggerModule.createDocument(app, swaggerConfig)
	SwaggerModule.setup('api/docs', app, document)

	app.use(
		'/uploads',
		(req, res, next) => {
			res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL)
			res.header('Cross-Origin-Resource-Policy', 'cross-origin')
			next()
		},
		express.static(join(__dirname, '..', 'uploads'))
	)

	await app.listen(config.get('PORT_SERVER'))
	console.log(`Application is running on: ${await app.getUrl()}`)
}

bootstrap().catch(err => {
	console.error('Error starting the application', err)
})
