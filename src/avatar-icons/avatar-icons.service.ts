import { Injectable } from '@nestjs/common';
import { User } from '../user/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AvatarIconsEntity } from './entity/avatar-icons.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AvatarIconsService {
  constructor(
    @InjectRepository(AvatarIconsEntity)
    private readonly avatarIconsEntityRepository: Repository<AvatarIconsEntity>,
  ) {}
  async createAvatarIcon(image: string, user: User) {
    return await this.avatarIconsEntityRepository.save({
      id: uuidv4(),
      image: image,
    });
  }

  async getAll() {
    return this.avatarIconsEntityRepository.find();
  }
}
