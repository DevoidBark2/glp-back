import { diskStorage } from 'multer'
import { HttpException, HttpStatus } from '@nestjs/common'

export const feedbacksMulterConfig = {
	fileFilter: (req: any, file: any, cb: any) => {
		const fileExtension = file.originalname
			.split('.')
			.slice(-1)[0]
			.toLowerCase()
		// Поддерживаемые форматы для изображений и видео
		if (/^(jpg|jpeg|png|svg|mp4|mov|avi|mkv|webm)$/.test(fileExtension)) {
			cb(null, true)
		} else {
			cb(
				new HttpException(
					`Неверный формат файла! (Поддерживаемые форматы: jpg, jpeg, png, svg, mp4, mov, avi, mkv, webm)`,
					HttpStatus.BAD_REQUEST
				),
				false
			)
		}
	},
	storage: diskStorage({
		destination: 'src/uploads',
		filename: (req, file, callback) => {
			const fileSplit = file.originalname.split('.')
			const name = fileSplit.slice(0, -1).join('.')
			const fileExtension = fileSplit.slice(-1)[0].toLowerCase()
			const newFileName = `${name}_${Date.now()}.${fileExtension}`

			callback(null, newFileName)
		}
	})
}
