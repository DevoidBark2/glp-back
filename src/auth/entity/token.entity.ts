import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryColumn,
	UpdateDateColumn
} from 'typeorm'
import { TokenType } from '../enum/token-type.enum'

@Entity('tokens')
export class Token {
	@PrimaryColumn({ type: 'uuid' })
	id: string
	@Column()
	email: string
	@Column({ type: 'varchar', unique: true })
	token: string
	@Column({ type: 'enum', enum: TokenType })
	type: TokenType
	@Column({ type: 'timestamp' })
	expiresIn: Date
	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date
}
