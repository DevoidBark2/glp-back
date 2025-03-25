import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query
} from '@nestjs/common'
import { FaqService } from './faq.service'
import { CreateFaqDto } from './dto/create-faq.dto'
import { UpdateFaqDto } from './dto/update-faq.dto'
import { Roles } from 'src/decorators/roles.decorator'
import { UserRole } from 'src/constants/contants'
import { ResponseMessage } from 'src/decorators/response-message.decorator'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('FAQ')
@Controller()
export class FaqController {
	constructor(private readonly faqService: FaqService) {}

	@Roles(UserRole.SUPER_ADMIN)
	@Post('faq')
	@ResponseMessage('Запись успешно создана!')
	create(@Body() createFaqDto: CreateFaqDto) {
		return this.faqService.create(createFaqDto)
	}

	@Get('faq')
	findAll() {
		return this.faqService.findAll()
	}

	@Get('faq/:id')
	async getFaqById(@Param('id') id: number) {
		return this.faqService.getById(id)
	}

	@Roles(UserRole.SUPER_ADMIN)
	@ResponseMessage('Запись успешно обновлена!')
	@Patch('faq')
	async update(@Body() updateFaqDto: UpdateFaqDto) {
		await this.faqService.update(updateFaqDto)
		return updateFaqDto
	}

	@Roles(UserRole.SUPER_ADMIN)
	@Delete(':id')
	@ResponseMessage('Запись успешно удалена!')
	remove(@Query('id') id: string) {
		return this.faqService.remove(+id)
	}
}
