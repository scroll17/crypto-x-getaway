import { Module } from '@nestjs/common';
import { CryptoXBotService } from './crypto-x-bot.service';
import { CryptoXBotUpdate } from './crypto-x-bot.update';
import { ProtectionModule } from '../../../protection/protection.module';
import { MarkdownHelper, TelegrafMessageHelper } from '@common/telegram/helpers';
import { TelegramNotificationBotService } from '../../notification/notification.service';
import { AccessTokenRepositoryProvider, UserRepositoryProvider } from '../../../database/repositories';


@Module({
  imports: [ProtectionModule],
  providers: [
    CryptoXBotService,
    CryptoXBotUpdate,
    MarkdownHelper,
    TelegrafMessageHelper,
    TelegramNotificationBotService,
    UserRepositoryProvider,
    AccessTokenRepositoryProvider,
  ],
  exports: [CryptoXBotService, TelegramNotificationBotService, MarkdownHelper],
})
export class CryptoXBotModule {}
