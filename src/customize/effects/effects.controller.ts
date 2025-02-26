import { Controller, Get } from '@nestjs/common';
import { EffectsService } from './effects.service';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { UserRole } from 'src/constants/contants';

@Controller('effects')
export class EffectsController {
  constructor(private readonly effectsService: EffectsService) { }


  @Authorization()
  @Get()
  async getAllEffects() {
    return await this.effectsService.findAll();
  }
}
