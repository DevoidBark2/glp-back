import { Body, Controller, Get, Post } from '@nestjs/common';
import { GeneralSettingsService } from './general-settings.service';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../constants/contants';
import { ApiTags } from '@nestjs/swagger';
import { ChangeGeneralSettingsDto } from './dto/change-general-settings.dto';

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

  @Roles(UserRole.SUPER_ADMIN)
  @Post('/general-settings')
  async changeGeneralSettings(@Body() settings: ChangeGeneralSettingsDto) {
    await this.generalSettingsService.change(settings);

    return {
      message: 'Настройки успешно обновлены!',
    };
  }
}
