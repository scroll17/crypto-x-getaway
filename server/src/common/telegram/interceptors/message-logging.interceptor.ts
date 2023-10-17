import * as _ from 'lodash';
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Injectable()
export class TelegrafMessageLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(this.constructor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const telegramContext = TelegrafExecutionContext.create(context).getContext<Context>();

    if (telegramContext.updateType !== 'message') return next.handle();

    const message = telegramContext.message!;
    this.logger.verbose('Telegram Bot Message:', {
      from: {
        id: message.from.id,
        firstName: message.from.first_name,
        username: message.from.username,
      },
      data: {
        text: _.get(message, ['text']),
      },
    });

    return next.handle();
  }
}
