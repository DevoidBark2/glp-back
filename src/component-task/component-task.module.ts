import { Module } from '@nestjs/common';
import { ComponentTaskService } from './component-task.service';
import { ComponentTaskController } from './component-task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComponentTask } from './entity/component-task.entity';
import { AnswersComponentUser } from './entity/component-task-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ComponentTask,AnswersComponentUser])],
  controllers: [ComponentTaskController],
  providers: [ComponentTaskService],
})
export class ComponentTaskModule {}
