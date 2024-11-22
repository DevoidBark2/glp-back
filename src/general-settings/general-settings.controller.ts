import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { GeneralSettingsService } from './general-settings.service';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../constants/contants';
import { ApiTags } from '@nestjs/swagger';
import { ChangeGeneralSettingsDto } from './dto/change-general-settings.dto';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
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
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo_url', maxCount: 1 },
      { name: 'default_avatar', maxCount: 1 },
    ], multerOptions)
  )
  async changeGeneralSettings(
    @Body() settings: ChangeGeneralSettingsDto,
    @UploadedFiles() files: { logo_url?: Express.Multer.File[]; default_avatar?: Express.Multer.File[] },
  ) {
    settings.logo_url = null;
    settings.default_avatar = null;

    // Check if files are uploaded
    if (files.logo_url && files.logo_url.length > 0) {
      settings.logo_url = `uploads/${files.logo_url[0].filename}`;
    }

    // Check if default avatar is uploaded
    if (files.default_avatar && files.default_avatar.length > 0) {
      settings.default_avatar = `uploads/${files.default_avatar[0].filename}`;
    }

    await this.generalSettingsService.change(settings);

    return {
      message: 'Настройки успешно обновлены!',
    };
  }
}
