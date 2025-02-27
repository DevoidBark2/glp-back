import {
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn
} from 'typeorm'
import { User } from '../../../user/entity/user.entity'
import { Frame } from '../../frames/entity/frames.entity'
import { Icon } from '../../icons/entity/icons.entity'
import { Effect } from '../../effects/entity/effects.entity'

@Entity('purchases')
export class Purchase {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => User, user => user.purchases)
	user: User

	@ManyToOne(() => Frame, { nullable: true }) // Покупка рамки
	frame: Frame

	@ManyToOne(() => Icon, { nullable: true }) // Покупка иконки
	icon: Icon

	@ManyToOne(() => Effect, { nullable: true }) // Покупка эффекта
	effect: Effect

	@CreateDateColumn()
	purchasedAt: Date
}
