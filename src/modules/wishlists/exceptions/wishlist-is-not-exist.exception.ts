import { HttpException, HttpStatus } from '@nestjs/common';

export class WishlistIsNotExistException extends HttpException {
  constructor() {
    super('Списка не существует', HttpStatus.NOT_FOUND);
  }
}
