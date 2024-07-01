import { HttpException, HttpStatus } from '@nestjs/common';

export class WishIsNotExistException extends HttpException {
  constructor() {
    super('Подарка не существует', HttpStatus.NOT_FOUND);
  }
}
