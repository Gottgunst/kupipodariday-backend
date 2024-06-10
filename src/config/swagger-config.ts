import { DocumentBuilder } from '@nestjs/swagger';

export const routeSwagger = '/api';

export const configSwagger = new DocumentBuilder()
  .setTitle('КупиПодариДай')
  .setDescription('API сервиса вишлистов')
  .setVersion('42.7.3')
  .build();
