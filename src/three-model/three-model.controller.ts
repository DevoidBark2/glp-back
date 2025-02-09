import { Controller } from '@nestjs/common';
import { ThreeModelService } from './three-model.service';

@Controller('three-model')
export class ThreeModelController {
  constructor(private readonly threeModelService: ThreeModelService) {}
}
