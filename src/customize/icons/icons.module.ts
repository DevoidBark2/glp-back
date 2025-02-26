import { Module } from '@nestjs/common';
import { IconsService } from './icons.service';
import { IconsController } from './icons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Icon } from './entity/icons.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Icon]), UserModule],
  controllers: [IconsController],
  providers: [IconsService],
})
export class IconsModule { }
