import { Module } from '@nestjs/common';
import { AvatarIconsService } from './avatar-icons.service';
import { AvatarIconsController } from './avatar-icons.controller';

@Module({
  controllers: [AvatarIconsController],
  providers: [AvatarIconsService],
})
export class AvatarIconsModule {}
