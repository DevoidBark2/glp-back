import { Controller, Get, Query, Res } from '@nestjs/common'
import { CertificateService } from './certificate.service'
import { Response } from 'express'

@Controller()
export class CertificateController {
	constructor(private readonly certificateService: CertificateService) {}

	@Get('get-certificate')
	async generateCertificate(
		@Res() res: Response,
		@Query('name') name: string,
		@Query('course') course: string,
		@Query('date') date: string
	) {
		const pdfBuffer = await this.certificateService.generateCertificate(
			name,
			course,
			date
		)

		res.set({
			'Content-Type': 'application/pdf',
			'Content-Disposition': `inline; filename="certificate.pdf"`,
			'Content-Length': pdfBuffer.length
		})

		res.end(pdfBuffer)
	}
}
