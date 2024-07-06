import { HttpException, HttpStatus } from '@nestjs/common';

export class OfferIsNotExistException extends HttpException {
  constructor() {
    super('Нет спонсора или складчины', HttpStatus.NOT_FOUND);
  }
}
