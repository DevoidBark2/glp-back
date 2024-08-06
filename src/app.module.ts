import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SettingsModule } from './settings/settings.module';
import { CourseModule } from './course/course.module';
import { SectionModule } from './section/section.module';
import { CategoryModule } from './category/category.module';
import { TestModule } from './test/test.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuards } from './auth/guards/auth.guards';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src', 'uploads'),
      serveRoot: '/uploads',
    }),

    AuthModule,
    UserModule,
    PostModule,
    SettingsModule,
    CourseModule,
    SectionModule,
    CategoryModule,
    TestModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuards,
    },
  ],
})
export class AppModule {}
