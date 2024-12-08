import { diskStorage } from 'multer';
import { HttpException, HttpStatus } from '@nestjs/common';

export const fileOptions = {
  // Фильтр для проверки типов файлов
  fileFilter: (req: any, file: any, cb: any) => {
    const fileExtension = file.originalname
      .split('.')
      .slice(-1)[0]
      .toLowerCase();
    const allowedExtensions =
      /^(jpg|jpeg|png|svg|webp|pdf|doc|docx|txt|xlsx|xls)$/;

    if (allowedExtensions.test(fileExtension)) {
      cb(null, true); // Разрешаем загрузку
    } else {
      cb(
        new HttpException(
          `Неверный формат файла! (Поддерживаемые форматы: jpg, jpeg, png, svg, webp, pdf, doc, docx, txt, xlsx, xls)`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  // Настройка хранения
  storage: diskStorage({
    destination: 'src/uploads',
    filename: (req, file, callback) => {
      const originalName = file.originalname.split('.').slice(0, -1).join('.'); // Имя без расширения
      const fileExtension = file.originalname.split('.').slice(-1)[0]; // Расширение файла
      const newFileName = `${originalName}_${Date.now()}.${fileExtension.toLowerCase()}`; // Имя с меткой времени

      callback(null, newFileName); // Устанавливаем имя файла с меткой времени
    },
  }),
};
