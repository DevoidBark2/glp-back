import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/user/entity/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class CoinsService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) {}

	async updateCoinsForUser(userId: string, coins: number) {
		const user = await this.userRepository.findOne({
			where: { id: userId }
		})
		await this.userRepository.update(userId, {
			coins: user.coins + coins
		})
	}
}
