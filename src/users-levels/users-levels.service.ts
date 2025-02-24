import { Injectable } from '@nestjs/common'
import { UserLevel } from './entity/user-level.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../user/entity/user.entity'
@Injectable()
export class UsersLevelsService {
	constructor(
		@InjectRepository(UserLevel)
		private readonly userLevelRepository: Repository<UserLevel>
	) {}

	async setDefaultLevelToUser(user: User) {
		await this.userLevelRepository.save({
			user: user
		})
	}

	async getUsersLevels() {
		return await this.userLevelRepository.find({
			relations: {
				user: true
			},
			select: {
				user: {
					id: true,
					first_name: true,
					last_name: true,
					second_name: true,
					method_auth: true,
					profile_url: true
				}
			}
		})
	}
}
