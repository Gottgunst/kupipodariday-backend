import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { UserExistException } from 'src/modules/users/exceptions';

@Catch(UserExistException)
export class UserExistExceptionFilter implements ExceptionFilter {
  catch(exception: UserExistException, host: ArgumentsHost) {
    const status = exception.getStatus();
    const message = exception.getResponse();

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(status).json({
      message: message,
    });
  }
}
