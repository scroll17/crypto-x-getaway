/*external modules*/
import cors from 'cors';
import {
  HttpException,
  HttpStatus,
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
/*modules*/
import { RedisModule } from './modules/redis/redis.module';
import { NgrokModule } from './modules/ngrok/ngrok.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { UserModule } from './modules/user/user.module';
import { SeedModule } from './modules/seed/seed.module';
import { TelegramModule } from './modules/telegram/telegram.module';
import { ProtectionModule } from './modules/protection/protection.module';
import { DatabaseModule } from './modules/database/database.module';
import { ActionModule } from './modules/action/action.module';
/*services*/
/*controllers*/
/*@entities*/
import { UserEntity } from '@entities/user';
import { AccessTokenEntity } from '@entities/accessToken';
import { AdminEntity } from '@entities/admin';
/*@common*/
import { LoggingInterceptor } from '@common/interceptors';
/*other*/
import { configuration } from './config/configuration';
import { usersConfiguration } from './config/users-configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration, usersConfiguration],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          url: configService.getOrThrow('postgres.url'),
          entities: [UserEntity, AccessTokenEntity, AdminEntity],
          logging: true,
          synchronize: configService.getOrThrow('database.syncEntities'),
          autoLoadEntities: configService.getOrThrow('database.autoLoadEntities'),
        };
      },
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    RedisModule, // Global
    NgrokModule, // Global
    ProtectionModule, // Global
    AuthModule,
    AdminModule,
    UserModule,
    ActionModule,
    SeedModule,
    TelegramModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private config: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    const logsEnabled = this.config.getOrThrow('logs.origin');
    const whitelist = this.config.getOrThrow('security.corsWhiteList');

    if (whitelist.length > 0) {
      consumer
        .apply(
          cors({
            methods: ['HEAD', 'PUT', 'PATCH', 'POST', 'GET', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token', 'x-forwarded-for'],
            exposedHeaders: ['*', 'Authorization', 'x-forwarded-for'],
            preflightContinue: false,
            credentials: true,
            origin: (origin, callback) => {
              if (logsEnabled)
                this.logger.debug('Request from origin:', {
                  origin: origin ?? typeof origin,
                  serverConfig: {
                    whitelist,
                  },
                });

              if (whitelist.includes('*')) {
                callback(null, true);
                return;
              }

              // Note: "!origin" -> for server requests
              if (whitelist.includes(origin) || !origin) {
                callback(null, true);
              } else {
                this.logger.error('Request from not allowed CORS');

                callback(new HttpException('Not allowed by CORS', HttpStatus.FORBIDDEN));
              }
            },
          }),
        )
        .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
  }
}
