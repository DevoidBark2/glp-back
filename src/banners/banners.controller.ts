import { Controller, Get } from '@nestjs/common';
import { BannersService } from './banners.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Баннеры')
@Controller()
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get('/banners')
  async getAllBanners() {
    return await this.bannersService.findAll();
  }
}
