import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './orm/data-source';
import { LoggingMiddleware } from './common/middlewares/logging.middleware';
import {
  AuthGuard,
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
} from 'nest-keycloak-connect';
import { ConfigService } from '@nestjs/config';
import configurationConfig from './config/configuration.config';
import { APP_GUARD } from '@nestjs/core';

const configService = new ConfigService(configurationConfig());

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource),
    KeycloakConnectModule.register({
      authServerUrl: configService.get('keycloak.url'),
      realm: configService.get('keycloak.realm'),
      clientId: configService.get('keycloak.clientId'),
      secret: configService.get('keycloak.secret'),
      cookieKey: 'KEYCLOAK_JWT',
      logLevels: ['error'],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
