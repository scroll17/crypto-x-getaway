import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { TelegrafException, TelegrafExecutionContext } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { TUserRepository, USER_REPOSITORY } from '../../../modules/database/repositories';

@Injectable()
export class TelegrafHasBotAccessGuard implements CanActivate {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: TUserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const tgCtx = TelegrafExecutionContext.create(context).getContext<Context>();

    if (tgCtx.updateType !== 'message') {
      throw new TelegrafException('Bad action');
    }

    const message = tgCtx.message!;

    const user = await this.userRepository.findOne({
      where: {
        telegramId: message.from.id,
      },
    });
    if (!user) {
      throw new TelegrafException('User not found');
    }

    return user.hasBotAccess;
  }
}
