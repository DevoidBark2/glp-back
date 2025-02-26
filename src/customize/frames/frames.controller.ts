import { Controller, Get } from '@nestjs/common';
import { FramesService } from './frames.service';
import { Authorization } from 'src/auth/decorators/auth.decorator';

@Controller('frames')
export class FramesController {
  constructor(private readonly framesService: FramesService) { }

  @Authorization()
  @Get()
  async getAllFrames() {
    return await this.framesService.findAll();
  }
}
