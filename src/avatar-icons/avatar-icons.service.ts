import { BadRequestException, Injectable } from '@nestjs/common';
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
  async createAvatarIcon(image: string) {
    return await this.avatarIconsEntityRepository.save({
      image: image,
    });
  }

  async getAll() {
    return this.avatarIconsEntityRepository.find();
  }
  async delete(id: number) {
    const existsAvatarIcon = await this.avatarIconsEntityRepository.findOneBy({
      id,
    });

    if (!existsAvatarIcon)
      throw new BadRequestException(`Иконки с ${id} не существует!`);

    await this.avatarIconsEntityRepository.delete(id);
  }
}
