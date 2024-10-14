import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { GeneralSettingsService } from './general-settings.service';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../constants/contants';
import { ApiTags } from '@nestjs/swagger';
import { ChangeGeneralSettingsDto } from './dto/change-general-settings.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multerConfig';

@ApiTags('Основые настройки')
@Controller()
export class GeneralSettingsController {
  constructor(
    private readonly generalSettingsService: GeneralSettingsService,
  ) { }

  @Get('/general-settings')
  async getGeneralSettings() {
    return this.generalSettingsService.getAll();
  }

  @Roles(UserRole.SUPER_ADMIN)
  @Post('/general-settings')
  @UseInterceptors(FileInterceptor('logo', multerOptions))
  async changeGeneralSettings(@Body() settings: ChangeGeneralSettingsDto, @UploadedFile() logo: Express.Multer.File,) {
    if (logo) {
      settings.logo_url = `/uploads/${logo.filename}`;
    }

    await this.generalSettingsService.change(settings);

    return {
      message: 'Настройки успешно обновлены!',
    };
  }
}
