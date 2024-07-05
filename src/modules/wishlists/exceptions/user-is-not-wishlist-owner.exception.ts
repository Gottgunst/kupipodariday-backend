import { HttpException, HttpStatus } from '@nestjs/common';

export class UserIsNotWishlistOwnerException extends HttpException {
  constructor() {
    super(
      'Нет прав редактировать или удалять чужие списки желаний',
      HttpStatus.UNAUTHORIZED,
    );
  }
}
