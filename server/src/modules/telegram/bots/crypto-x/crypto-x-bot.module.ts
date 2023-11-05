import { Module } from '@nestjs/common';
import { CryptoXBotService } from './crypto-x-bot.service';
import { CryptoXBotUpdate } from './crypto-x-bot.update';
import { MarkdownHelper, TelegrafMessageHelper } from '@common/telegram/helpers';
import { TelegramNotificationBotService } from '../../notification/notification.service';
import { AccessTokenRepositoryProvider, UserRepositoryProvider } from '../../../database/repositories';
import { ActionModule } from '../../../action/action.module';
import { SetServerUrlWizard } from './scenes';

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
    // Scenes
    SetServerUrlWizard,
  ],
  exports: [CryptoXBotService, TelegramNotificationBotService, MarkdownHelper],
})
export class CryptoXBotModule {}
