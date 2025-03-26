import { diskStorage } from 'multer'
import { HttpException, HttpStatus } from '@nestjs/common'

export const multerOptions = {
	fileFilter: (req: any, file: any, cb: any) => {
		const fileExtension = file.originalname.split('.').slice(-1)[0]
		if (/^(jpg|jpeg|png|svg|webp)$/.test(fileExtension)) {
			cb(null, true)
		} else {
			cb(
				new HttpException(
					`Неверный формат картинки! (Поддерживаемый формат: jpg,jpeg,png,svg)`,
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
			const fileExtension = fileSplit.slice(-1)[0]
			const newFileName = `${name}_${Date.now()}.${fileExtension}`

			callback(null, newFileName)
		}
	})
}
