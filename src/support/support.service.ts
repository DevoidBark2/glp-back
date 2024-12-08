import { Injectable } from '@nestjs/common';
import { CreateSupportDto } from './dto/create-support.dto';
import { Support } from './entity/support.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateSupportDto } from './dto/update-support.dto';

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(Support)
    private readonly supportRepository: Repository<Support>,
  ) {}
  async sendMsgInSupport(createSupportDto: CreateSupportDto) {
    return await this.supportRepository.save({
      customerName: createSupportDto.customerName,
      customerEmail: createSupportDto.customerEmail,
      question: createSupportDto.question,
    });
  }

  sendMsgFromSupport(updateSupportDto: UpdateSupportDto) {
    //return `This action returns all support`;
  }
}
