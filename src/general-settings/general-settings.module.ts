import { Module } from '@nestjs/common';
import { GeneralSettingsService } from './general-settings.service';
import { GeneralSettingsController } from './general-settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeneralSettingsEntity } from './entity/general-settings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GeneralSettingsEntity])],
  controllers: [GeneralSettingsController],
  providers: [GeneralSettingsService],
  exports: [GeneralSettingsService],
})
export class GeneralSettingsModule { }
