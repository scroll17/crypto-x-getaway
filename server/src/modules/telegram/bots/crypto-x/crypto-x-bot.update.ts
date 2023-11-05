import * as _ from 'lodash';
import { Action, Command, Ctx, Help, InjectBot, Next, On, Start, Update, Use } from 'nestjs-telegraf';
import { Context, Telegraf, Scenes, session } from 'telegraf';
import { Logger, UseFilters, UseInterceptors } from '@nestjs/common';
import { CryptoXBotService } from './crypto-x-bot.service';
import { TelegrafExceptionFilter } from '@common/telegram/filters';
import { TelegrafAuthUser, TelegrafCurrentUser } from '@common/telegram/decorators';
import { ITelegramUser } from '@common/types';
import { MarkupCallbackButtonName } from '@common/telegram/enums';
import { telegrafMessageLoggingMiddleware } from '@common/telegram/middlewares';

const stage = new Scenes.Stage([]);

@Update()
@UseInterceptors()
@UseFilters(TelegrafExceptionFilter)
export class CryptoXBotUpdate {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectBot()
    private readonly bot: Telegraf<Context>,
    private readonly cryptoXBotService: CryptoXBotService,
  ) {}

  @Use()
  useMiddleware(ctx: Context, next: () => Promise<void>) {
    const middleware = telegrafMessageLoggingMiddleware.middleware();
    return middleware(ctx, next);
  }

  @Use()
  useSession(ctx: Context, next: () => Promise<void>) {
    const middleware = session();
    return middleware(ctx, next);
  }

  @Use()
  useStage(ctx: any, next: () => Promise<void>) {
    const middleware = stage.middleware();
    return middleware(ctx, next);
  }

  @Start()
  async onStart(@Ctx() ctx: Context): Promise<string> {
    return `Бот запущен`;
  }

  @On('message')
  async onMessage(@Ctx() ctx: Context, @Next() next: () => Promise<void>): Promise<void> {
    return next();
  }

  @Help()
  @TelegrafAuthUser()
  async onHelp(): Promise<string> {
    const commands = [
      '/get_user_secret - Получить секрет для аутентификации',
      '/get_user_token - Получить полный токен аутентификации',
      '/refresh_user_secret - Обновить секрет для аутентификации',
      '/set_action_server_url - Установить адрес Action server',
    ].join('\n');
    const description = ['Секрет аутентификации используеться в Action server'].join('\n');

    return `${commands}\n\n${description}`;
  }

  @Command('get_user_secret')
  @TelegrafAuthUser()
  async onGetUserSecretCommand(@TelegrafCurrentUser() tgUser: ITelegramUser, @Ctx() ctx: Context): Promise<void> {
    const message = await this.cryptoXBotService.getUserSecret(tgUser.telegramId);
    await ctx.replyWithMarkdownV2(message);
  }

  @Command('get_user_token')
  @TelegrafAuthUser()
  async onGetUserTokenCommand(@TelegrafCurrentUser() tgUser: ITelegramUser, @Ctx() ctx: Context): Promise<void> {
    const message = await this.cryptoXBotService.getUserToken(tgUser.telegramId);
    await ctx.replyWithMarkdownV2(message);
  }

  @Command('refresh_user_secret')
  @TelegrafAuthUser()
  async onRefreshUserSecretCommand(@TelegrafCurrentUser() tgUser: ITelegramUser, @Ctx() ctx: Context): Promise<void> {
    const message = await this.cryptoXBotService.refreshUserSecret(tgUser.telegramId);
    await ctx.replyWithMarkdownV2(message);
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
