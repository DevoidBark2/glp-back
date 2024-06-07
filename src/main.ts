import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as process from "process";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const PORT = process.env.PORT_SERVER || 4000;

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
