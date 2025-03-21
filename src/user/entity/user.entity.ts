import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	OneToOne,
	PrimaryColumn,
	UpdateDateColumn
} from 'typeorm'
import { CourseEntity } from '../../course/entity/course.entity'
import PostEntity from '../../post/entity/post.entity'
import { UserRole } from '../../constants/contants'
import { StatusUserEnum } from '../enum/user-status.enum'
import { TableSize } from '../enum/table-size.enum'
import { TableFooter } from '../enum/table-footer.enum'
import { CourseUser } from 'src/course/entity/course-user.entity'
import { AuthMethodEnum } from '../../auth/enum/auth-method.enum'
import { Account } from './account.entity'
import ReviewCourse from 'src/review/entity/review.entity'
import { AchievementUser } from 'src/achievements/entities/achievement-users.entity'
import { UserLevel } from 'src/users-levels/entity/user-level.entity'
import { Purchase } from '../../customize/purchases/entity/purchases.entity'
import { ActiveCustomization } from '../../customize/active_customizations/entity/active_customizations.entity'
import { ExamUsers } from '../../exams/entity/exam-users.entity'

@Entity('users')
export class User {
	@PrimaryColumn({ type: 'uuid' })
	id: string
	@Column()
	first_name: string
	@Column({ nullable: true })
	second_name: string
	@Column({ nullable: true })
	last_name: string
	@Column({ unique: true, nullable: false })
	email: string
	@Column({ nullable: true })
	phone: string
	@Column()
	password: string
	@Column({ nullable: true })
	city: string
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
	@OneToMany(() => CourseEntity, course => course.user, {
		onDelete: 'CASCADE'
	})
	courses: CourseEntity[]
	@OneToMany(() => PostEntity, post => post.user)
	posts: PostEntity[]
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
	isVerified: boolean
	@Column({ default: false })
	is_two_factor_enabled: boolean
	@Column({ type: 'enum', enum: AuthMethodEnum, nullable: true })
	method_auth: AuthMethodEnum
	@OneToMany(() => Account, account => account.user)
	accounts: Account[]
	@OneToMany(() => ReviewCourse, review => review.user, { cascade: true })
	reviews: ReviewCourse[]
	@OneToMany(() => AchievementUser, achievementUser => achievementUser.user)
	achievements: AchievementUser[]
	@OneToOne(() => UserLevel, userLevel => userLevel.user, { cascade: true })
	userLevel: UserLevel
	@Column({ type: 'int', default: 0 })
	coins: number
	@OneToMany(() => Purchase, purchase => purchase.user)
	purchases: Purchase[]

	@OneToOne(() => ActiveCustomization, customization => customization.user)
	activeCustomization: ActiveCustomization
	@OneToMany(() => ExamUsers, exam => exam.user, { onDelete: 'CASCADE' })
	exams: ExamUsers[]
}
