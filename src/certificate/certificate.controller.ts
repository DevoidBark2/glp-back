import { Controller, Get, Query, Req, Res } from '@nestjs/common'
import { CertificateService } from './certificate.service'
import { Response } from 'express'
import { Authorization } from '../auth/decorators/auth.decorator'

@Controller()
export class CertificateController {
	constructor(private readonly certificateService: CertificateService) {}

	@Authorization()
	@Get('get-certificate')
	async generateCertificate(
		@Req() req: Request,
		@Res() res: Response,
		@Query('courseId') courseId: number
	) {
		const pdfBuffer = await this.certificateService.generateCertificate(
			courseId,
			req['user']
		)

		res.set({
			'Content-Type': 'application/pdf',
			'Content-Disposition': `attachment; filename="certificate.pdf"`,
			'Content-Length': pdfBuffer.length
		})

		res.end(pdfBuffer)
	}
}
