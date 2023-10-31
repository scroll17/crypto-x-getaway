import * as _ from 'lodash';
import { Action, Command, Ctx, Help, InjectBot, Next, On, Start, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { Logger, UseFilters, UseInterceptors } from '@nestjs/common';
import { CryptoXBotService } from './crypto-x-bot.service';
import { TelegrafMessageLoggingInterceptor } from '@common/telegram/interceptors';
import { TelegrafExceptionFilter } from '@common/telegram/filters';
import { TelegrafAuthUser, TelegrafCurrentUser } from '@common/telegram/decorators';
import { ITelegramUser } from '@common/types';
import { MarkupCallbackButtonName } from '@common/telegram/enums';

@Update()
@UseInterceptors(TelegrafMessageLoggingInterceptor)
@UseFilters(TelegrafExceptionFilter)
export class CryptoXBotUpdate {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectBot()
    private readonly bot: Telegraf<Context>,
    private readonly cryptoXBotService: CryptoXBotService,
  ) {}

  @Start()
  async onStart(@Ctx() ctx: Context): Promise<string> {
    return `Бот запущен`;
  }

  @On('message')
  async onMessage(@Ctx() ctx: Context, @Next() next: () => Promise<void>): Promise<void> {
    const message = (ctx.update as any)['message'];

    this.logger.log('Telegram Bot Message:', {
      from: {
        id: message.from.id,
        firstName: message.from.first_name,
        username: message.from.username,
      },
      data: {
        text: message.text,
      },
    });

    return next();
  }

  @Help()
  @TelegrafAuthUser()
  async onHelp(): Promise<string> {
    const commands = [
      '/get_user_secret - Получить токен аутентификации',
      '/refresh_user_secret - Обновить токен аутентификации',
      '/set_action_server_url - Установить адрес Action server',
    ].join('\n');
    const description = ['Токен аутентификации используеться в Action server'].join('\n');

    return `${commands}\n\n${description}`;
  }

  @Command('get_user_secret')
  @TelegrafAuthUser()
  async onGetUserSecretCommand(@TelegrafCurrentUser() tgUser: ITelegramUser, @Ctx() ctx: Context): Promise<void> {
    const message = await this.cryptoXBotService.getUserSecret(ctx.message!.from.id);
    await ctx.replyWithMarkdown(message);
  }

  @Command('refresh_user_secret')
  @TelegrafAuthUser()
  async onRefreshUserSecretCommand(@Ctx() ctx: Context): Promise<void> {
    const message = await this.cryptoXBotService.refreshUserSecret(ctx.message!.from.id);
    await ctx.replyWithMarkdown(message);
  }

  // Note: priority - 1
  @Action(new RegExp(MarkupCallbackButtonName.DisapproveAccessToken))
  @TelegrafAuthUser()
  async disapproveAccessTokenAction(@TelegrafCurrentUser() tgUser: ITelegramUser, @Ctx() ctx: Context) {
    await ctx.answerCbQuery();

    await this.cryptoXBotService.disapproveAccessToken(tgUser.telegramId, _.get(ctx.callbackQuery, ['data']));

    await ctx.reply('Token removed');
  }

  // Note: priority - 2
  @Action(new RegExp(MarkupCallbackButtonName.ApproveAccessToken))
  @TelegrafAuthUser()
  async approveAccessTokenAction(@TelegrafCurrentUser() tgUser: ITelegramUser, @Ctx() ctx: Context) {
    await ctx.answerCbQuery();

    await this.cryptoXBotService.approveAccessToken(tgUser.telegramId, _.get(ctx.callbackQuery, ['data']));

    await ctx.reply('Token confirmed');
  }
}
