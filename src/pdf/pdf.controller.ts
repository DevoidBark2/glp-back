import { Controller, Get, Res } from '@nestjs/common'
import { PdfService } from './pdf.service'
import { Response } from 'express'

@Controller('pdf')
export class PdfController {
	constructor(private readonly pdfService: PdfService) {}

	@Get()
	async generatePdf(@Res() response: Response) {
		const pdfStream = await this.pdfService.generate()

		// response.setHeader('Content-Type', 'application/pdf')
		// response.setHeader(
		// 	'Content-Disposition',
		// 	'inline; filename="document.pdf"'
		// )
		//
		// pdfStream.pipe(response)
	}
}
