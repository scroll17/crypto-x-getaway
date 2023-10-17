import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { TTelegrafUpdateType } from 'src/common/telegram/types/telegraf';

export const TelegramUpdateType = createParamDecorator(
  (_, ctx: ExecutionContext) => TelegrafExecutionContext.create(ctx).getContext().updateType as TTelegrafUpdateType,
);
