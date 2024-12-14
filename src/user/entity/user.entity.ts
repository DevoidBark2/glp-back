import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'
import { CourseEntity } from '../../course/entity/course.entity'
import PostEntity from '../../post/entity/post.entity'
import { UserRole } from '../../constants/contants'
import { SettingsEntity } from '../../settings/entity/settings.entity'
import { StatusUserEnum } from '../enum/user-status.enum'
import { TableSize } from '../enum/table-size.enum'
import { TableFooter } from '../enum/table-footer.enum'
import { CourseUser } from 'src/course/entity/course-user.entity'

@Entity('users')
export class User {
	@PrimaryGeneratedColumn()
	id: number
	@Column()
	first_name: string
	@Column({ nullable: true })
	second_name: string
	@Column({ nullable: true })
	last_name: string
	@Column()
	email: string
	@Column({ nullable: true })
	phone: string
	@Column()
	password: string
	@Column({ nullable: true })
	city: string
	@Column({ nullable: true })
	university: string
	@Column({ nullable: true })
	about_me: string
	@Column({
		type: 'enum',
		enum: StatusUserEnum,
		default: StatusUserEnum.ACTIVATED
	})
	status: StatusUserEnum
	@Column({ nullable: true })
	birth_day: Date
	@Column({ type: 'enum', enum: UserRole })
	role: UserRole
	@CreateDateColumn()
	created_at: Date
	@UpdateDateColumn()
	updated_at: Date
	@OneToMany(() => CourseEntity, course => course.user)
	@JoinColumn()
	courses: CourseEntity[]
	@OneToMany(() => PostEntity, post => post.user)
	@JoinColumn()
	posts: PostEntity[]
	@OneToOne(() => SettingsEntity, settings => settings.user)
	settings: SettingsEntity
	@Column({ type: 'varchar', nullable: true })
	profile_url: string
	@Column({ type: 'numeric', nullable: true, default: 0 })
	login_attempts: number
	@Column({ type: 'numeric', nullable: true, default: 0 })
	lock_until: number
	@Column({ type: 'numeric', nullable: true, default: 5 })
	pagination_size: number
	@Column({ type: 'enum', enum: TableSize, default: TableSize.MIDDLE })
	table_size: TableSize
	@Column({ type: 'boolean', nullable: true, default: false })
	show_footer_table: boolean
	@Column({
		type: 'enum',
		enum: TableFooter,
		default: TableFooter.TOTAL_ENTRIES
	})
	footerContent: TableFooter
	@OneToMany(() => CourseUser, courseUser => courseUser.user)
	courseUsers: CourseUser[]
	@Column({ nullable: true })
	verify_email: Date
}
