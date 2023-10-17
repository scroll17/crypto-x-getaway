import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TelegrafExecutionContext, TelegrafException } from 'nestjs-telegraf';
import { Context } from 'telegraf';

export const TelegramCurrentUser = createParamDecorator((_dataKey, ctx: ExecutionContext) => {
  const tgCtx = TelegrafExecutionContext.create(ctx).getContext<Context>();

  if (tgCtx.updateType === 'message') {
    const message = tgCtx.message!;

    return {
      telegramId: message.from.id,
      name: message.from.first_name,
      username: message.from.username,
      chatId: message.chat.id,
    };
  }

  throw new TelegrafException(`Unsupported updateType = "${tgCtx.updateType}"`);
});
