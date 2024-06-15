import { HttpException, HttpStatus } from '@nestjs/common';

export class UserExistException extends HttpException {
  constructor() {
    super('Email или username уже заняты', HttpStatus.CONFLICT);
  }
}
