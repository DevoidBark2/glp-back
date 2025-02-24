import { Module } from '@nestjs/common'
import { CommentsService } from './comments.service'
import { CommentsController } from './comments.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Comments } from './entity/comments.entity'
import { UserModule } from '../user/user.module'
import { SectionEntity } from '../section/entity/section.entity'

@Module({
	imports: [TypeOrmModule.forFeature([Comments, SectionEntity]), UserModule],
	controllers: [CommentsController],
	providers: [CommentsService]
})
export class CommentsModule { }
