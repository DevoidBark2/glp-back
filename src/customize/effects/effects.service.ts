import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Effect } from './entity/effects.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EffectsService {
    constructor(
        @InjectRepository(Effect)
        private readonly effectRepository: Repository<Effect>
    ) { }

    async findAll() {
        return this.effectRepository.find()
    }
}
