import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { routeSwagger } from './config/swagger-config';

@ApiExcludeController()
@Controller()
export class AppController {
  @Get('')
  @Redirect(routeSwagger)
  index() {
    return;
  }
}
