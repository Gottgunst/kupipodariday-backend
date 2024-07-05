import { HttpException, HttpStatus } from '@nestjs/common';

export class WishIsYoursException extends HttpException {
  constructor() {
    super('Нельзя скидываться на своё желание', HttpStatus.CONFLICT);
  }
}
