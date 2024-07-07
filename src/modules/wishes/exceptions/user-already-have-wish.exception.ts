import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyHaveWishException extends HttpException {
  constructor() {
    super('Вы уже добавили себе это желание', HttpStatus.CONFLICT);
  }
}
