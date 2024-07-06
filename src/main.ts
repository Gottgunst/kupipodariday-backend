import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { configSwagger, routeSwagger } from './config/swagger-config';
import helmet from 'helmet';
import { CommonExceptionsFilter } from './common/filters';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);
  const configService = app.get(ConfigService);

  app.enableCors();
  app.use(helmet());

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new CommonExceptionsFilter({ httpAdapter }));

  SwaggerModule.setup(
    routeSwagger,
    app,
    SwaggerModule.createDocument(app, configSwagger),
    { swaggerOptions: { persistAuthorization: true } },
  );

  await app.listen(configService.get('server.port'));
}
bootstrap();
