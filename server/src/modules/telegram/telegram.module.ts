import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CryptoXBotModule } from './bots/crypto-x/crypto-x-bot.module';
import { telegrafMessageLoggingMiddleware } from '@common/telegram/middlewares';

@Module({
  imports: [
    CryptoXBotModule,
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: function (configService: ConfigService) {
        this.botName = configService.getOrThrow<string>('telegram.botName');

        const botEnabled = configService.getOrThrow<boolean>('telegram.botEnabled');
        return {
          token: configService.getOrThrow('telegram.token'),
          include: botEnabled ? [CryptoXBotModule] : [],
          middlewares: [telegrafMessageLoggingMiddleware],
        };
      },
    }),
  ],
  exports: [CryptoXBotModule],
})
export class TelegramModule {}
