import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'
import { User } from '../../../user/entity/user.entity'
import { Frame } from '../../frames/entity/frames.entity'
import { Icon } from '../../icons/entity/icons.entity'
import { Effect } from '../../effects/entity/effects.entity'

@Entity('active_customizations')
export class ActiveCustomization {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => User, user => user.activeCustomization, {
		onDelete: 'CASCADE'
	})
	user: User

	@ManyToOne(() => Frame, frame => frame.id)
	frame: Frame

	@ManyToOne(() => Icon, icon => icon.id)
	icon: Icon

	@ManyToOne(() => Effect, effect => effect.id)
	effect: Effect

	@UpdateDateColumn()
	updatedAt: Date
}
