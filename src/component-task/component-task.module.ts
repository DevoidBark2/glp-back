import { Module } from '@nestjs/common';
import { ComponentTaskService } from './component-task.service';
import { ComponentTaskController } from './component-task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComponentTask } from './entity/component-task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ComponentTask])],
  controllers: [ComponentTaskController],
  providers: [ComponentTaskService],
})
export class ComponentTaskModule {}
