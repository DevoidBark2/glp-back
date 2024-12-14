import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn
} from 'typeorm'
import { CourseEntity } from '../../course/entity/course.entity'
import { User } from '../../user/entity/user.entity'
import { StatusSectionEnum } from '../enum/status_section.enum'
import { MainSection } from './main-section.entity'
import { SectionComponentTask } from './section-component-task.entity'
import { FileType } from '../dto/create_section_course.dto'

@Entity('sections')
export class SectionEntity {
	@PrimaryGeneratedColumn()
	id: number
	@Column({ type: 'varchar', length: 64 })
	name: string
	@Column({ type: 'varchar', length: 100, nullable: true })
	description: string
	@Column({ type: 'json', nullable: true })
	externalLinks: string[]
	@Column({ type: 'json', nullable: true })
	uploadFile: FileType[]
	@Column({
		type: 'enum',
		enum: StatusSectionEnum,
		default: StatusSectionEnum.ACTIVE
	})
	status: StatusSectionEnum
	@ManyToOne(() => CourseEntity, course => course.sections, {
		onDelete: 'CASCADE'
	})
	course: CourseEntity
	@ManyToOne(() => User, user => user.id)
	user: User
	@CreateDateColumn()
	created_at: Date
	@ManyToOne(() => MainSection, mainSection => mainSection.id, {
		onDelete: 'SET NULL',
		nullable: true
	})
	parentSection: MainSection
	@Column({ type: 'numeric', nullable: true })
	sort_number: number
	@OneToMany(
		() => SectionComponentTask,
		sectionComponent => sectionComponent.section
	)
	sectionComponents: SectionComponentTask[]
}
