import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch(HttpException)
export class FileLimitExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    console.log(response);
    if (
      status === HttpStatus.BAD_REQUEST &&
      exception.message.includes('Too many files')
    ) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message:
          'Превышено допустимое количество файлов. Максимум — 10 файлов.',
        error: 'Bad Request',
      });
    }

    response.status(status).json({
      statusCode: status,
      message: 'SADasdasdasd',
    });
  }
}
