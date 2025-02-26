import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Icon } from './entity/icons.entity';

@Injectable()
export class IconsService {
    constructor(
        @InjectRepository(Icon)
        private readonly iconRepository: Repository<Icon>
    ) { }

    async findAll() {
        return this.iconRepository.find()
    }
}
