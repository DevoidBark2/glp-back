import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { EventEntity } from './entity/event.entity'
import { User } from '../user/entity/user.entity'

@Injectable()
export class EventsService {
	constructor(
		@InjectRepository(EventEntity)
		private readonly eventRepository: Repository<EventEntity>
	) {}

	async getAll() {
		return this.eventRepository.find({
			relations: { user: true },
			order: {
				created_at: 'DESC'
			}
		})
	}

	async createEvent(user: User, action: string, description: string) {
		const event = this.eventRepository.create({
			user,
			action,
			description
		})
		return this.eventRepository.save(event)
	}
}
