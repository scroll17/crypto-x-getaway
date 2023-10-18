import { Module } from '@nestjs/common';
import { CryptoXBotService } from './crypto-x-bot.service';
import { CryptoXBotUpdate } from './crypto-x-bot.update';
import { ProtectionModule } from '../../../protection/protection.module';
import { MarkdownHelper } from '@common/telegram/helpers';
import { TelegramNotificationBotService } from '../../notification/notification.service';
import { UserRepositoryProvider } from '../../../database/repositories';

@Module({
  imports: [ProtectionModule],
  providers: [
    CryptoXBotService,
    CryptoXBotUpdate,
    MarkdownHelper,
    TelegramNotificationBotService,
    UserRepositoryProvider,
  ],
  exports: [CryptoXBotService, TelegramNotificationBotService, MarkdownHelper],
})
export class CryptoXBotModule {}
