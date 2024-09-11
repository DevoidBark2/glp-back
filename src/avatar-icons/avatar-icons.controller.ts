import { Controller } from '@nestjs/common';
import { AvatarIconsService } from './avatar-icons.service';

@Controller('avatar-icons')
export class AvatarIconsController {
  constructor(private readonly avatarIconsService: AvatarIconsService) {}
}
