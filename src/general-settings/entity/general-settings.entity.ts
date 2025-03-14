import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { ComplexityPasswordEnum } from '../enum/complexity-password.enum'
import { UserRole } from '../../constants/contants'
import { ModeratorAccessRightsEnum } from '../enum/moderator-access-rights.enum'
import { ModerationAccess } from '../enum/moderation-access.enum'

@Entity('general-settings')
export class GeneralSettingsEntity {
	@PrimaryGeneratedColumn()
	id: number
	@Column({ type: 'varchar', default: '' })
	platform_name: string
	@Column({ type: 'varchar', length: 255, nullable: true })
	logo_url: string
	@Column({ type: 'boolean', nullable: true, default: false })
	service_mode: boolean
	@Column({ type: 'varchar', nullable: true })
	service_mode_text: string
	@Column({ type: 'numeric', default: 8 })
	min_password_length: number
	@Column({
		type: 'enum',
		enum: ComplexityPasswordEnum,
		default: ComplexityPasswordEnum.MEDIUM
	})
	password_complexity: ComplexityPasswordEnum
	@Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
	default_user_role: UserRole
	@Column({ type: 'boolean', nullable: true, default: false })
	auto_confirm_register: boolean
	@Column({ type: 'boolean', nullable: true, default: false })
	user_complaint_notification: boolean
	@Column({ type: 'numeric', default: 30 })
	period_of_inactive: number
	@Column({ type: 'boolean', default: false })
	auto_publish_course: boolean
	@Column({ type: 'numeric', default: 10 })
	max_upload_file_size: number
	@Column({ type: 'boolean', default: false })
	moderation_review_course: boolean
	@Column({ type: 'boolean', default: false })
	moderation_new_course: boolean
	@Column({ type: 'boolean', default: false })
	audit_enabled: boolean
	// For moderators settings
	@Column({ type: 'json', default: [] })
	accessRights: ModeratorAccessRightsEnum[]
	@Column({ type: 'varchar', nullable: true })
	support_email: string
	@Column({ type: 'varchar', nullable: true })
	contact_phone: string
	@Column({ type: 'varchar', nullable: true })
	subscription_platform: string
	@Column({ type: 'numeric', nullable: true })
	course_creation_limit: number
	@Column({ type: 'boolean', nullable: true })
	course_rating_system: boolean
	@Column({ type: 'boolean', nullable: true })
	allow_extra_materials: boolean
	@Column({ type: 'boolean', nullable: true })
	allow_course_comments: boolean
	@Column({ type: 'numeric', nullable: true })
	max_login_attempts: number
	@Column({ type: 'numeric', nullable: true })
	lockout_duration: number
	@Column({ type: 'varchar', nullable: true })
	default_avatar: string
	@Column({ type: 'json', default: [] })
	moderationAccess: ModerationAccess
}
