import { Controller, Get } from '@nestjs/common';
import { IconsService } from './icons.service';
import { Authorization } from 'src/auth/decorators/auth.decorator';

@Controller('icons')
export class IconsController {
  constructor(private readonly iconsService: IconsService) { }

  @Authorization()
  @Get()
  async getAllFrames() {
    return await this.iconsService.findAll();
  }
}
