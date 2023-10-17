import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TelegrafExecutionContext, TelegrafException } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { ITelegramUser } from '@common/types';

export const TelegramCurrentUser = createParamDecorator<keyof ITelegramUser>((dataKey, ctx: ExecutionContext) => {
  const tgCtx = TelegrafExecutionContext.create(ctx).getContext<Context>();

  if (tgCtx.updateType === 'message') {
    const message = tgCtx.message!;

    const userData: ITelegramUser = {
      telegramId: message.from.id,
      name: message.from.first_name,
      username: message.from.username,
      chatId: message.chat.id,
    };

    if (dataKey) return userData[dataKey];

    return userData;
  }

  throw new TelegrafException(`Unsupported updateType = "${tgCtx.updateType}"`);
});
