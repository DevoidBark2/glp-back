import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { SettingsEntity } from './entity/settings.entity';
import { JwtService } from '@nestjs/jwt';
import { ChangeUserSettingsDto } from './dto/change_user_settings.dto';
import { DEFAULT_SETTINGS_FOR_NEW_USER } from '../constants/contants';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(SettingsEntity)
    private readonly settingsEntityRepository: Repository<SettingsEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async getUserSettings(req: Request) {
    const currentUser: User = req['user'];
    return await this.settingsEntityRepository.findOne({
      where: {
        user: { id: currentUser.id },
      },
    });
  }

  async changeUserSettings(changeUserSettings: ChangeUserSettingsDto) {
    await this.settingsEntityRepository.update(changeUserSettings.id, {
      ...changeUserSettings,
    });

    return await this.settingsEntityRepository.findOne({
      where: { id: changeUserSettings.id },
    });
  }

  async resetUserSettings(req: Request) {
    const currentUser: User = req['user'];
    const currentSetting = await this.settingsEntityRepository.findOne({
      where: {
        user: { id: currentUser.id },
      },
      relations: {
        user: true,
      },
    });

    await this.settingsEntityRepository.update(currentSetting.id, {
      ...currentSetting,
      ...{
        vertex_color: DEFAULT_SETTINGS_FOR_NEW_USER.VERTEX_COLOR,
        edge_color: DEFAULT_SETTINGS_FOR_NEW_USER.EDGE_COLOR,
        type_vertex: DEFAULT_SETTINGS_FOR_NEW_USER.TYPE_VERTEX,
        border_vertex: DEFAULT_SETTINGS_FOR_NEW_USER.BORDER_VERTEX,
        enabled_grid: DEFAULT_SETTINGS_FOR_NEW_USER.ENABLED_GRID,
        background_color: DEFAULT_SETTINGS_FOR_NEW_USER.BACKGROUND_COLOR,
      },
    });
  }
}
