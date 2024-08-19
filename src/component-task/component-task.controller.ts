import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ComponentTaskService } from './component-task.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateComponentTaskDto } from './dto/create-component-task.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../constants/contants';

@ApiTags('Компоненты раздела')
@Controller('')
export class ComponentTaskController {
  constructor(private readonly componentTaskService: ComponentTaskService) {}

  @Roles(UserRole.SUPER_ADMIN, UserRole.TEACHER)
  @Get('/component-task')
  async getComponentTask(@Req() req: Request) {
    return await this.componentTaskService.getAll(req['user']);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.TEACHER)
  @Post('/component-task')
  async createComponentTask(
    @Body() body: CreateComponentTaskDto,
    @Req() req: Request,
  ) {
    const component = await this.componentTaskService.create(body, req['user']);

    return {
      message: 'Компонент успешно создан!',
      component: component,
    };
  }
}
