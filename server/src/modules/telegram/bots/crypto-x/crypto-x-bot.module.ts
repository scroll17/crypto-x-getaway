import { Module } from '@nestjs/common';
import { CryptoXBotService } from './crypto-x-bot.service';
import { CryptoXBotUpdate } from './crypto-x-bot.update';
import { MarkdownHelper, TelegrafMessageHelper } from '@common/telegram/helpers';
import { TelegramNotificationBotService } from '../../notification/notification.service';
import { AccessTokenRepositoryProvider, UserRepositoryProvider } from '../../../database/repositories';
import { ActionModule } from '../../../action/action.module';

@Module({
  imports: [ActionModule],
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
