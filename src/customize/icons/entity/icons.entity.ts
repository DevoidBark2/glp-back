import { UserLevelEnum } from 'src/users-levels/enums/user-level.enum'
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('icons')
export class Icon {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ unique: true })
	name: string

	@Column({ type: 'int' })
	price: number

	@Column({ type: 'varchar' })
	type: string

	@Column({
		type: 'enum',
		enum: UserLevelEnum
	})
	minLevel: string
}
