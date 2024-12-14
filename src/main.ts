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

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const PORT = process.env.PORT_SERVER || 4000

	app.setGlobalPrefix('api')
	const reflector = app.get(Reflector)
	app.useGlobalPipes(new ValidationPipe())
	app.useGlobalInterceptors(new ResponseInterceptor(reflector))

	// app.use(helmet());
	// app.use(compression());
	app.use(cookieParser())

	const config = new DocumentBuilder()
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

	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('api/docs', app, document)

	app.enableCors({
		origin: process.env.CLIENT_URL,
		credentials: true
	})

	app.use(
		'/uploads',
		(req, res, next) => {
			res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL)
			res.header('Cross-Origin-Resource-Policy', 'cross-origin')
			next()
		},
		express.static(join(__dirname, '..', 'uploads'))
	)

	await app.listen(PORT)
	console.log(`Application is running on: ${await app.getUrl()}`)
}

bootstrap().catch(err => {
	console.error('Error starting the application', err)
})
