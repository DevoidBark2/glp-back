import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BannerEntity } from './entity/banner.entity';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(BannerEntity)
    private readonly bannerEntityRepository: Repository<BannerEntity>,
  ) {}

  async findAll() {
    return await this.bannerEntityRepository.find();
  }
}
