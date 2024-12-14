import { ComplexityPasswordEnum } from '../enum/complexity-password.enum'
import { UserRole } from '../../constants/contants'
import { ApiProperty } from '@nestjs/swagger'

export class ChangeGeneralSettingsDto {
	@ApiProperty()
	id: number
	@ApiProperty()
	platform_name: string
	@ApiProperty()
	logo_url: string
	@ApiProperty()
	service_mode: boolean
	@ApiProperty()
	cache_enabled: boolean
	@ApiProperty()
	min_password_length: number
	@ApiProperty()
	password_complexity: ComplexityPasswordEnum
	@ApiProperty()
	default_user_role: UserRole
	@ApiProperty()
	auto_confirm_register: boolean
	@ApiProperty()
	user_complaint_notification: boolean
	@ApiProperty()
	period_of_inactive: number
	@ApiProperty()
	auto_publish_course: boolean
	@ApiProperty()
	max_upload_file_size: number
	@ApiProperty()
	moderation_review_course: boolean
	@ApiProperty()
	moderation_new_course: boolean
	@ApiProperty()
	default_avatar: string
}
