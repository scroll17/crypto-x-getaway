import {
  Command,
  Ctx,
  Help,
  InjectBot,
  Next,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { Logger } from '@nestjs/common';
import {CryptoXBotService} from "./crypto-x-bot.service";

@Update()
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
  async onMessage(@Ctx() ctx: Context, @Next() next: Function): Promise<void> {
    const message = (ctx.update as any)['message'];

    console.log('mes 1 => ', ctx.message )
    console.log('mes 1 => ', (ctx.update as any)['message'] )


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
  async onHelp(): Promise<string> {
    const commands = [
      '/get_auth_token - Получить токен аутентификации',
      '/get_client_url - Получить URL клиента',
      '/get_server_url - Получить URL сервера',
    ].join('\n');
    const description = [
      'URL клиента это ссылка на CRM сайт',
      'Токен аутентификации используеться на стороне клиента',
      'URL сервера также используеться на стороне клиента',
    ].join('\n');

    return `${commands}\n\n${description}`;
  }

  @Command('get_server_url')
  async onGetServerUrlCommand(@Ctx() ctx: Context): Promise<void> {
    const message = await this.cryptoXBotService.getServerUrl();
    await ctx.replyWithMarkdown(message);
  }
}
