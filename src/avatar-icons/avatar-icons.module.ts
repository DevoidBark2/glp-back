import { Module } from '@nestjs/common';
import { AvatarIconsService } from './avatar-icons.service';
import { AvatarIconsController } from './avatar-icons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvatarIconsEntity } from './entity/avatar-icons.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AvatarIconsEntity])],
  controllers: [AvatarIconsController],
  providers: [AvatarIconsService],
})
export class AvatarIconsModule {}
