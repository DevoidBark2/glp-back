import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as process from 'process';
import { AuthGuard } from './auth/guards/auth.guards';
import { SetMetadata } from '@nestjs/common';
import { AuthService } from './auth/auth.service';

export const Public = () => SetMetadata('isPublic', true);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT_SERVER || 4000;

  const reflector = app.get(Reflector);
  const authService = app.get(AuthService);
  app.useGlobalGuards(new AuthGuard(reflector, authService));
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('GLP')
    .setDescription('Graph Learning Platform')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
}
bootstrap();
