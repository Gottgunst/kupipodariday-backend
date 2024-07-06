import { HttpException, HttpStatus } from '@nestjs/common';

export class OfferIsDoubleException extends HttpException {
  constructor() {
    super('Вы уже спонсор этого желания', HttpStatus.CONFLICT);
  }
}
