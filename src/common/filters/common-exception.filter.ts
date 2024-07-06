import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class CommonExceptionsFilter implements ExceptionFilter {
  constructor(private httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    // ======================================

    const exceptionObject = ((exception) => {
      switch (true) {
        case exception instanceof HttpException:
          return {
            message: exception.message,
            statusCode: exception.getStatus(),
          };
        default:
          return {
            message: 'Ошибка сервера — ' + exception.message,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          };
      }
    })(exception);

    // ======================================

    const responseBody = {
      ...exceptionObject,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(
      ctx.getResponse(),
      responseBody,
      exceptionObject.statusCode,
    );
  }
}
