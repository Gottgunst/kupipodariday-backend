import { HttpException, HttpStatus } from '@nestjs/common';

export class WishHasOffersException extends HttpException {
  constructor() {
    super(
      'Запрещено менять цену подарка при наличии спонсоров',
      HttpStatus.FORBIDDEN,
    );
  }
}
