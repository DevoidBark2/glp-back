import { Controller, Get } from '@nestjs/common';
import { GeneralSettingsService } from './general-settings.service';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../constants/contants';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Основые настройки')
@Controller()
export class GeneralSettingsController {
  constructor(
    private readonly generalSettingsService: GeneralSettingsService,
  ) {}

  @Roles(UserRole.SUPER_ADMIN)
  @Get('/general-settings')
  async getGeneralSettings() {
    return this.generalSettingsService.getAll();
  }
}
