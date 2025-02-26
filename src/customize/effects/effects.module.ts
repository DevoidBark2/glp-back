import { Module } from '@nestjs/common';
import { EffectsService } from './effects.service';
import { EffectsController } from './effects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Effect } from './entity/effects.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Effect]), UserModule],
  controllers: [EffectsController],
  providers: [EffectsService],
})
export class EffectsModule { }
