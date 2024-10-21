import { Injectable } from '@nestjs/common';
import { ComplexityPasswordEnum } from './enum/complexity-password.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeneralSettingsEntity } from './entity/general-settings.entity';
import { ChangeGeneralSettingsDto } from './dto/change-general-settings.dto';

@Injectable()
export class GeneralSettingsService {
  constructor(
    @InjectRepository(GeneralSettingsEntity)
    private readonly generalSettingsEntityRepository: Repository<GeneralSettingsEntity>,
  ) { }
  private determinePasswordComplexity(
    password: string,
  ): ComplexityPasswordEnum {
    let complexity = 0;

    if (password.length >= 8) {
      complexity++;
    }
    if (/[A-Z]/.test(password)) {
      complexity++;
    }
    if (/[a-z]/.test(password)) {
      complexity++;
    }
    if (/\d/.test(password)) {
      complexity++;
    }
    if (/[^A-Za-z0-9]/.test(password)) {
      complexity++;
    }

    switch (complexity) {
      case 5:
        return ComplexityPasswordEnum.VERY_HIGH;
      case 4:
        return ComplexityPasswordEnum.HIGH;
      case 3:
        return ComplexityPasswordEnum.MEDIUM;
      default:
        return ComplexityPasswordEnum.LOW;
    }
  }

  async getAll() {
    return this.generalSettingsEntityRepository.find();
  }

  async change(settings: ChangeGeneralSettingsDto) {
    await this.generalSettingsEntityRepository.update(settings.id, settings);
  }
}
