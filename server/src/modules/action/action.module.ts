import { Global, Module } from '@nestjs/common';
import { ActionService } from './action.service';
import { DataGenerateHelper, IpHelper } from '@common/helpers';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ActionController } from './action.controller';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports: [
    HttpModule.register({}),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          global: false,
          secret: configService.getOrThrow('action.userSecurityTokenSecret'),
          signOptions: {
            expiresIn: configService.getOrThrow('action.userSecurityTokenExpires'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [ActionService, DataGenerateHelper, IpHelper],
  controllers: [ActionController],
  exports: [ActionService, DataGenerateHelper, IpHelper],
})
export class ActionModule {}
