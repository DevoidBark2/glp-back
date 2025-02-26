import { Module } from '@nestjs/common';
import { FramesService } from './frames.service';
import { FramesController } from './frames.controller';
import { Frame } from './entity/frames.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Frame]), UserModule],
  controllers: [FramesController],
  providers: [FramesService],
})
export class FramesModule { }
