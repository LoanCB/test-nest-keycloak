import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import configurationConfig from './config/configuration.config';
import { ValidationError, useContainer } from 'class-validator';
import {
  BadRequestException,
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { buildErrors } from './common/helpers/validation-error.helper';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = new ConfigService(configurationConfig());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const PORT = configService.get('port') || 3100;
  const APP_ROUTE_PREFIX = 'api';

  app
    .setGlobalPrefix(APP_ROUTE_PREFIX)
    .enableVersioning({ type: VersioningType.URI })
    .useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        stopAtFirstError: true,
        exceptionFactory: (validationErrors: ValidationError[] = []) => {
          return new BadRequestException(
            buildErrors(validationErrors),
            'Validation Error',
          );
        },
      }),
    )
    .enableCors();

  await app.listen(PORT);

  Logger.log(
    `🚀 Test-NEST-KEYCLOAK is running on: http://localhost:${PORT}/${APP_ROUTE_PREFIX}`,
  );
}
bootstrap();
