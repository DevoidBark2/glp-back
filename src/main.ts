import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as process from 'process'
import { ResponseInterceptor } from './interceptors/response.interceptor'
import { ValidationPipe } from '@nestjs/common'
import helmet from 'helmet'
import * as express from 'express'
import * as compression from 'compression'
import * as cookieParser from 'cookie-parser'
import { join } from 'path'
import { ConfigService } from '@nestjs/config'
import IORedis from 'ioredis'
import * as session from 'express-session'
import { ms, StringValue } from './libs/common/utils/ms.util'
import { parseBoolean } from './libs/common/utils/pasrse-boolean.util'
import { RedisStore } from 'connect-redis'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const reflector = app.get(Reflector)

	const config = app.get(ConfigService)
	const redis = new IORedis(config.getOrThrow('REDIS_URI'))

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true
		})
	)

	app.use(cookieParser(config.getOrThrow('COOKIES_SECRET')))

	app.enableCors({
		origin: config.getOrThrow<string>('CLIENT_URL'),
		credentials: true,
		exposedHeaders: ['set-cookie']
	})

	app.use(
		session({
			secret: config.getOrThrow('SESSION_SECRET'),
			name: config.getOrThrow('SESSION_NAME'),
			resave: true,
			saveUninitialized: false,
			cookie: {
				domain: config.getOrThrow('SESSION_DOMAIN'),
				maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
				httpOnly: parseBoolean(
					config.getOrThrow<string>('SESSION_HTTP_ONLY')
				),
				secure: parseBoolean(
					config.getOrThrow<string>('SESSION_SECURE')
				),
				sameSite: 'lax'
			},
			store: new RedisStore({
				client: redis,
				prefix: config.getOrThrow('SESSION_FOLDER')
			})
		})
	)

	// app.setGlobalPrefix('api')

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

	await app.listen(config.getOrThrow('PORT_SERVER'))
	console.log(`Application is running on: ${await app.getUrl()}`)
}

bootstrap().catch(err => {
	console.error('Error starting the application', err)
})
