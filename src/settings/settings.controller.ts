import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Put,
  Req,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ChangeUserSettingsDto } from './dto/change_user_settings.dto';

@ApiTags('Настройки')
@Controller()
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('/user-settings')
  @ApiQuery({ name: 'token', description: 'Authorization token' })
  async getUserSettings(@Req() req: Request) {
    try {
      const token = req.headers['authorization'];

      const userSettings = await this.settingsService.getUserSettings(token);

      return {
        userSettings: userSettings,
      };
    } catch (e) {
      throw new BadRequestException(`Ошибка при получении данных: ${e}`);
    }
  }

  @Put('/user-settings')
  @ApiQuery({ name: 'token', description: 'Authorization token' })
  async changeUserSettings(
    @Req() req: Request,
    @Body() userSettings: ChangeUserSettingsDto,
  ) {
    try {
      const token = req.headers['authorization'];

      await this.settingsService.changeUserSettings(token, userSettings);

      return {
        message: 'Данные успешно сохранены!',
      };
    } catch (e) {
      throw new BadRequestException(`Ошибка при обновлении данных: ${e}`);
    }
  }
}
