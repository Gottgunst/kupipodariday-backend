import { HttpException, HttpStatus } from '@nestjs/common';

export class UserIsNotOwnerException extends HttpException {
  constructor() {
    super(
      'Нет прав редактировать или удалять чужие подарки',
      HttpStatus.UNAUTHORIZED,
    );
  }
}
