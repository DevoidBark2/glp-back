import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn
} from 'typeorm'
import { User } from '../../user/entity/user.entity'
import { SectionEntity } from '../../section/entity/section.entity'
import { CategoryEntity } from '../../category/entity/category.entity'
import { AccessRightEnum } from '../enum/access_right.enum'
import { LevelCourseEnum } from '../enum/level_course.enum'
import { StatusCourseEnum } from '../enum/status_course.enum'
import { CourseUser } from './course-user.entity'

@Entity('courses')
export class CourseEntity {
	@PrimaryGeneratedColumn()
	id: number
	@Column({ type: 'varchar', length: 64 })
	name: string
	@Column({ type: 'text', nullable: true })
	image: string
	@Column({ type: 'varchar', length: 255 })
	small_description: string
	@ManyToOne(() => CategoryEntity, category => category.id, {
		nullable: true,
		onDelete: 'SET NULL'
	})
	category: CategoryEntity
	@Column({ type: 'enum', enum: AccessRightEnum })
	access_right: number
	@Column({ type: 'numeric' })
	duration: number
	@Column({ type: 'enum', enum: LevelCourseEnum })
	level: number
	@Column({ type: 'timestamp', nullable: true })
	publish_date: Date
	@Column({ type: 'text', nullable: true })
	content_description: string
	@Column({ type: 'varchar', length: 255, nullable: true })
	secret_key: string
	@Column({
		type: 'enum',
		enum: StatusCourseEnum,
		default: StatusCourseEnum.NEW
	})
	status: StatusCourseEnum
	@Column({ type: 'bool', nullable: false })
	has_certificate: boolean
	@ManyToOne(() => User)
	user: User
	@OneToMany(() => SectionEntity, sections => sections.course)
	sections: SectionEntity[]
	@OneToMany(() => CourseUser, courseUser => courseUser.course)
	courseUsers: CourseUser[]
	@CreateDateColumn()
	created_at: Date
}
