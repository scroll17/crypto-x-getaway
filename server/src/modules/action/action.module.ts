import { Global, Module } from '@nestjs/common';
import { ActionService } from './action.service';
import { DataGenerateHelper, IpHelper } from '@common/helpers';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ActionController } from './action.controller';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          global: false,
          secret: configService.get('protection.securityTokenSecret'),
          signOptions: {
            expiresIn: configService.get('protection.securityTokenExpires'),
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
