import { Module } from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectionEntity } from './entity/section.entity';
import { User } from '../user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SectionEntity, User])],
  controllers: [SectionController],
  providers: [SectionService],
})
export class SectionModule {}
