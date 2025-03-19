import { Injectable } from '@nestjs/common'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import fs from 'fs'
import { User } from '../user/entity/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CourseEntity } from '../course/entity/course.entity'
const robotoFont = fs.readFileSync(
	'./src/certificate/fonts/Roboto-Regular.ttf',
	'base64'
)

@Injectable()
export class CertificateService {
	constructor(
		@InjectRepository(CourseEntity)
		private readonly courseEntityRepository: Repository<CourseEntity>
	) {}

	async generateCertificate(courseId: number, user: User): Promise<Buffer> {
		const course = await this.courseEntityRepository.findOne({
			where: { id: courseId }
		})
		const doc = new jsPDF('l', 'mm', 'a4') // Landscape A4 format

		// Добавление поддержки кириллицы через Roboto
		doc.addFileToVFS('Roboto-Regular.ttf', robotoFont)
		doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal')
		doc.setFont('Roboto')

		// Декоративный фон через фигуры
		doc.setFillColor(240, 248, 255) // Светло-голубой фон
		doc.rect(0, 0, 297, 210, 'F')

		// Рамка с декоративными линиями
		doc.setDrawColor(0, 102, 204)
		doc.setLineWidth(3)
		doc.rect(10, 10, 277, 190)

		// Декоративная внутренняя рамка
		doc.setDrawColor(0, 51, 153)
		doc.setLineWidth(1)
		doc.rect(15, 15, 267, 180)

		// Заголовок
		doc.setFontSize(32)
		doc.setTextColor(0, 102, 204)
		doc.text('СЕРТИФИКАТ', 148.5, 50, { align: 'center' })

		// Подзаголовок
		doc.setFontSize(18)
		doc.setTextColor(0, 0, 0)
		doc.text(`Подтверждает, что`, 148.5, 70, {
			align: 'center'
		})

		// Имя получателя
		doc.setFontSize(26)
		doc.setTextColor(0, 51, 102)
		doc.text(
			`${user.second_name ?? ''} ${user.first_name ?? ''} ${user.last_name ?? ''}`,
			148.5,
			90,
			{ align: 'center' }
		)

		// Курс
		doc.setFont('Roboto', 'normal')
		doc.setFontSize(18)
		doc.text(
			`успешно завершил(а) обучение на курсе: "${course.name}"`,
			148.5,
			110,
			{ align: 'center' }
		)

		// Дата выдачи = дате завершения экзамена
		doc.setFontSize(14)
		doc.text(`Дата выдачи сертификата: ${Date.now()}`, 148.5, 130, {
			align: 'center'
		})

		doc.setFontSize(12)
		doc.text('Руководитель курса:   Иванов Иван Иванович', 60, 170)

		// Печать как буфер данных
		return Buffer.from(doc.output('arraybuffer'))
	}
}
