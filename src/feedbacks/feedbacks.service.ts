import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { FeedBackEntity } from './entity/feedback.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UserRole } from 'src/constants/contants';

@Injectable()
export class FeedbacksService {
    constructor(
        @InjectRepository(FeedBackEntity)
        private readonly feedBakRepository: Repository<FeedBackEntity>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
      ) {}

    async sendFeedBack(message:string, user: User){
        console.log(user)
        const superAdminUser = await this.userRepository.findOne({where: {role: UserRole.SUPER_ADMIN}});
        await this.feedBakRepository.save({
            id: uuidv4(),
            sender: user.role !== UserRole.SUPER_ADMIN ? user : superAdminUser,
            message: message,
            recipient: user.role !== UserRole.SUPER_ADMIN ? superAdminUser : user
        })
    }
}
