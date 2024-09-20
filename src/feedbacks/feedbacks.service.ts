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
      ) {}

    async sendFeedBack(message:string, user: User, attachments: Express.Multer.File[]){
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
        const attachmentEntities = attachments.map((file) => {
            return this.attachmentRepository.create({
            filename: file.originalname,
            filepath: file.path,
            mimetype: file.mimetype,
            feedback: savedFeedback,
            });
        });

        await this.attachmentRepository.save(attachmentEntities);
        }

        return savedFeedback;
    }

    async getFeedBackForUser(user: User) {
        const superAdminUser = await this.userRepository.findOne({ where: { role: UserRole.SUPER_ADMIN } });

        const feedbacks = await this.feedbackRepository.find({
            where: [
                { sender: { id: user.id } },
                { recipient: { id: superAdminUser.id } },
            ],
            relations: ['attachments', 'sender', 'recipient'],
        });

        console.log(feedbacks)

        return feedbacks.map(feedback => ({
            id: feedback.id,
            message: feedback.message,
            sender: {
                id: feedback.sender.id,
                name: feedback.sender.first_name
            },
            recipient: {
                id: feedback.recipient.id,
                name: feedback.recipient.first_name,
            },
            sent_at: feedback.sent_at,
            attachments: feedback.attachments.map(attachment => ({
                id: attachment.id,
                filename: attachment.filename,
                filepath: attachment.filepath,
                mimetype: attachment.mimetype,
            })),
        }));
    }
}
