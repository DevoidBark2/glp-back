import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('support')
export class Support {
	@PrimaryGeneratedColumn()
	id: number
	@Column({ type: 'varchar', nullable: false })
	customerName: string
	@Column({ type: 'varchar', nullable: true })
	customerEmail: string
	@Column({ type: 'varchar', nullable: false })
	question: string
}
