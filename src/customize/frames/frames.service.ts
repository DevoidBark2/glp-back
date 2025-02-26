import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Frame } from './entity/frames.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FramesService {
    constructor(
        @InjectRepository(Frame)
        private readonly frameRepository: Repository<Frame>
    ) { }

    async findAll() {
        return this.frameRepository.find()
    }
}
