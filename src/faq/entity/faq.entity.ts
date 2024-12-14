import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('faq')
export class FaqEntity {
	@PrimaryGeneratedColumn()
	id: number
	@Column({ type: 'varchar', length: 255 })
	question: string
	@Column({ type: 'varchar' })
	answer: string
}
