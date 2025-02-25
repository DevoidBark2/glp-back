import { Module } from '@nestjs/common';
import { XpService } from './xp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { UserLevel } from 'src/users-levels/entity/user-level.entity';
import { AchievementsService } from 'src/achievements/achievements.service';
import { AchievementsModule } from 'src/achievements/achievements.module';
import { AchievementUser } from 'src/achievements/entities/achievement-users.entity';
import { Achievement } from 'src/achievements/entities/achievement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserLevel, AchievementUser, Achievement]), AchievementsModule],
  providers: [XpService, AchievementsService],
})
export class XpModule { }
