import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { FeedBackEntity } from './entity/feedback.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UserRole } from 'src/constants/contants';
import { FeedbackAttachmentEntity } from './entity/feedback-attachment.entity';

@Injectable()
export class FeedbacksService {
    constructor(
        @InjectRepository(FeedBackEntity)
        private readonly feedbackRepository: Repository<FeedBackEntity>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(FeedbackAttachmentEntity)
        private readonly attachmentRepository: Repository<FeedbackAttachmentEntity>
    ) { }

    async sendFeedBack(message: string, user: User, attachments: Express.Multer.File[]) {
        const superAdminUser = await this.userRepository.findOne({ where: { role: UserRole.SUPER_ADMIN } });

        const feedback = this.feedbackRepository.create({
            id: uuidv4(),
            sender: user.role !== UserRole.SUPER_ADMIN ? user : superAdminUser,
            message: message,
            recipient: user.role !== UserRole.SUPER_ADMIN ? superAdminUser : user,
        });

        // Сохраняем сообщение
        const savedFeedback = await this.feedbackRepository.save(feedback);

        // Если есть вложения, сохраняем их
        if (attachments && attachments.length > 0) {
            attachments.map((file) => {
                this.attachmentRepository.save({
                    filename: file.originalname,
                    filepath: file.path,
                    mimetype: file.mimetype,
                    feedback: savedFeedback,
                });
            });
        }

        return savedFeedback;
    }

    async getFeedBackForUser(user: User) {
        const superAdminUser = await this.userRepository.findOne({ where: { role: UserRole.SUPER_ADMIN } });

        return await this.feedbackRepository.find({
            where: [
                { sender: { id: user.id }, recipient: { id: superAdminUser.id } }, // Сообщения от данного пользователя к супер-администратору
                { sender: { id: superAdminUser.id }, recipient: { id: user.id } }, // Сообщения от супер-администратора к данному пользователю
            ],
            relations: ['attachments', 'sender', 'recipient'],
        });
    }
}
