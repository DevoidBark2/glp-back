import { Injectable } from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { FaqEntity } from './entity/faq.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(FaqEntity)
    private readonly faqEntityRepository: Repository<FaqEntity>,
  ) {}
  async create(createFaqDto: CreateFaqDto) {
    const existingFaq = await this.faqEntityRepository.findOne({
      where: { question: createFaqDto.question },
    });

    if (existingFaq) {
      throw new Error('FAQ with this question already exists.');
    }

    return await this.faqEntityRepository.save({
      question: createFaqDto.question,
      answer: createFaqDto.answer,
    });
  }

  async findAll() {
    return await this.faqEntityRepository.find();
  }

  async update(updateFaqDto: UpdateFaqDto) {
    await this.faqEntityRepository.update(updateFaqDto.id, {
      question: updateFaqDto.question,
      answer: updateFaqDto.answer,
    });
  }

  async remove(id: number) {
    await this.faqEntityRepository.delete(id);
  }
}
