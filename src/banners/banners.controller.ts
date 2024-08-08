import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BannersService } from './banners.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../constants/contants';
import { CreateBannerDto } from './entity/dto/create-banner.dto';
import { ResponseMessage } from '../decorators/response-message.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Баннеры')
@Controller()
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get('/banners')
  async getAllBanners() {
    return await this.bannersService.findAll();
  }

  @Roles(UserRole.SUPER_ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @Post('/banners')
  async createBanner(
    @Body() createBannerDto: CreateBannerDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    console.log(createBannerDto);
    console.log(image);
    return await this.bannersService.create(createBannerDto);
  }

  @Roles(UserRole.SUPER_ADMIN)
  @Delete('banners/:id')
  @ResponseMessage('Баннер успешно удален!')
  async deleteBanner(@Param('id') id: number) {
    return await this.bannersService.delete(id);
  }

  @Roles(UserRole.SUPER_ADMIN)
  @Put('banners/:id')
  async changeBanner(@Param('id') id: number) {
    return await this.bannersService.change();
  }
}
