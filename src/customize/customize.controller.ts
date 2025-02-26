import { Controller } from '@nestjs/common';
import { CustomizeService } from './customize.service';

@Controller('customize')
export class CustomizeController {
  constructor(private readonly customizeService: CustomizeService) {}
}
