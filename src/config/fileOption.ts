import { diskStorage } from 'multer'
import { HttpException, HttpStatus } from '@nestjs/common'

export const fileOptions = {
	fileFilter: (req: any, file: any, cb: any) => {
		const fileExtension = file.originalname
			.split('.')
			.slice(-1)[0]
			.toLowerCase()
		const allowedExtensions =
			/^(jpg|jpeg|png|svg|webp|pdf|doc|docx|txt|xlsx|xls)$/

		if (allowedExtensions.test(fileExtension)) {
			cb(null, true)
		} else {
			cb(
				new HttpException(
					`Неверный формат файла! (Поддерживаемые форматы: jpg, jpeg, png, svg, webp, pdf, doc, docx, txt, xlsx, xls)`,
					HttpStatus.BAD_REQUEST
				),
				false
			)
		}
	},
	storage: diskStorage({
		destination: 'src/uploads',
		filename: (req, file, callback) => {
			const originalName = file.originalname
				.split('.')
				.slice(0, -1)
				.join('.')
			const fileExtension = file.originalname.split('.').slice(-1)[0]
			const newFileName = `${originalName}_${Date.now()}.${fileExtension.toLowerCase()}`

			callback(null, newFileName)
		}
	})
}
